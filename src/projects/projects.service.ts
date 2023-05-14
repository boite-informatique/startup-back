import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectCreationService } from './project-creation.service';
import { ValidationDto } from './dto/project-validation.dto';
import { UpdateProjectPeriodsDto } from './dto/update-project-periods.dto';
import { Prisma } from '@prisma/client';
import { JSONValue } from 'postgres';
import { UpdateProjectDto } from './dto/update-project.dto';
import { periodsType } from './types/periodes.type';
import { PeriodError } from './errors/periode-error';

@Injectable()
export class ProjectsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly projectCreationService: ProjectCreationService,
    ) {}

    async getProjects(user: any) {
        let projects = [];
        if (user.type == 'student') {
            projects = await this.prismaService.project.findMany({
                where: { members: { some: { id: user.sub } } },
                take: 1,
                include: {
                    members: true,
                    supervisors: true,
                    validation: true,
                    owner: true,
                },
            });
        } else {
            projects = await this.prismaService.project.findMany({
                where: {
                    OR: {
                        owner_id: user.sub,
                        supervisors: { some: { id: user.sub } },
                    },
                },
                include: {
                    members: true,
                    supervisors: true,
                    validation: true,
                    owner: true,
                },
            });
        }

        if (projects.length == 0)
            throw new NotFoundException('No projects found');
        return projects;
    }

    async createProject(user: any, body: CreateProjectDto) {
        return await this.projectCreationService.createProject(user, body);
    }

    // scientific committee
    async getProjectsForSC(userId: number) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            select: { teacher: { select: { establishment_id: true } } },
        });

        const { establishment_id } = user.teacher;

        return await this.prismaService.project.findMany({
            where: {
                owner: {
                    OR: {
                        teacher: { establishment_id },
                        student: { establishment_id },
                    },
                },
            },
            include: {
                members: true,
                supervisors: true,
                validation: true,
                owner: true,
            },
        });
    }

    async validateProject(
        userId: number,
        projectId: number,
        body: ValidationDto,
    ) {
        try {
            const projectValidation =
                await this.prismaService.projectValidation.create({
                    data: {
                        ...body,
                        project_id: projectId,
                        validator_id: userId,
                    },
                });
            return projectValidation;
        } catch (err) {
            throw new NotFoundException('Project not found');
        }
    }

    async updateProject(
        userId: number,
        body: UpdateProjectDto,
        projectId: number,
    ) {
        const settings  = await this.prismaService.settings.findUnique({
            where: { tag: 'PROJECT_PERIODS' },
        })
        const periodes = settings.value as periodsType;
        const today = new Date();
        const s=new Date(periodes.submission)
        const v=new Date(periodes.validation)
        const a=new Date(periodes.appeal)
        const av=new Date(periodes.appealValidation)
        const e=new Date(periodes.end)
        if((s<today && today<v)||(a<today && today<av)){
        try {
            return await this.prismaService.project.updateMany({
                where: { id: projectId, owner_id: userId },
                data: body,
            });
        } catch (error) {throw new NotFoundException('Project not found')}}else{throw new PeriodError('out of period error')}
    }

    async getProjectPeriods() {
       try{ return await this.prismaService.settings.findUnique({
            where: { tag: 'PROJECT_PERIODS' },
        });}catch(error){throw new NotFoundException('Project not found')}
    }

    async updateProjectPeriods(body: UpdateProjectPeriodsDto) {
        const { submission, validation, appeal, appealValidation, end } = body;
        const s=new Date(submission)
        const v=new Date(validation)
        const a=new Date(appeal)
        const av=new Date(appealValidation)
        const e=new Date(end)

        if (
            s < v &&
            v < a &&
            a < av &&
            av < e
        ) {
           return this.prismaService.settings.update({
                data: { value: body as unknown as Prisma.JsonValue },
                where: { tag: 'PROJECT_PERIODS' },
            });
        }else { throw new PeriodError('periods error')}  }
    

    async getProjectTasks(projectId: number) {
        try {
            const tasks = await this.prismaService.projectTask.findMany({
                where: { project_id: projectId },
            });
            if (tasks.length == 0)
                throw new NotFoundException('No tasks found');
            return tasks;
        } catch (_) {
            throw new NotFoundException('No project found');
        }
    }
    async deleteProject(id: number){ 
        const settings  = await this.prismaService.settings.findUnique({
            where: { tag: 'PROJECT_PERIODS' },
        })
        const periodes = settings.value as periodsType;
        const today = new Date();
        const s=new Date(periodes.submission)
        const v=new Date(periodes.validation)
        if(s<today && today<v){ try {
        return await this.prismaService.project.delete({
            where: { id: id },
        })
    } catch (_) {
        throw new NotFoundException();
    }}else{throw new PeriodError('out of period error')}}
}
