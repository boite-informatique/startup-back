import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectCreationService } from './project-creation.service';
import { ValidationDto } from './dto/project-validation.dto';
import { UpdateProjectPeriodsDto } from './dto/update-project-periods.dto';
import { Prisma } from '@prisma/client';
import { UpdateProjectDto } from './dto/update-project.dto';
import { createDefenseDocument } from 'src/defense-doc/dto/create-defense-doc.dto';
import { CreateProjectProgressDto } from 'src/project-progress/dto/create-project-progress.dto';
import { CreateDefensePlanificationDto } from 'src/defense-planification/dto/create-defense-planification.dto';
import { CreateDefenseAuthorizationDto } from './dto/create-defense-authorization.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';

@Injectable()
export class ProjectsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly projectCreationService: ProjectCreationService,
    ) {}

    async getProject(projectId: number) {
        const project = await this.prismaService.project.findUnique({
            where: {
                id: projectId,
            },
            include: {
                DefenseAuthorization: true,
                DefenseDocument: true,
                DefensePlanification: true,
                history: {
                    include: { user: true },
                },
                members: true,
                owner: true,
                ProjectInvitees: true,
                supervisors: true,
                ProjectProgress: {
                    include: { user: true },
                },
                ProjectTask: {
                    include: { user: true },
                },
                validation: {
                    include: { validator: true },
                },
            },
        });

        if (!project) {
            throw new NotFoundException('Project not found');
        }
        return project;
    }

    async deleteDefensePlanification(projectId: number) {
        return await this.prismaService.defensePlanification.delete({
            where: {
                project_id: projectId,
            },
        });
    }
    async createDefensePlanification(
        projectId: number,
        body: CreateDefensePlanificationDto,
    ) {
        try {
            return await this.prismaService.defensePlanification.create({
                data: {
                    project_id: projectId,
                    jury_members: {
                        connect:
                            body.jury_members.length > 0
                                ? body.jury_members.map((memberId) => ({
                                      id: memberId,
                                  }))
                                : undefined,
                    },
                    jury_invities: {
                        connect:
                            body.jury_invities.length > 0
                                ? body.jury_invities.map((inviteId) => ({
                                      id: inviteId,
                                  }))
                                : undefined,
                    },
                    jury_president: body.jury_president,
                    establishement_id: body.establishement_id,
                    date: body.date,
                    mode: body.mode,
                    nature: body.nature,
                },
                include: {
                    jury_invities: true,
                    jury_members: true,
                },
            });
        } catch (_) {
            throw new ConflictException(
                'This project already have a defense planification',
            );
        }
    }

    async getDefensePlanification(projectId: number) {
        return this.prismaService.defensePlanification.findUnique({
            where: { project_id: projectId },
            include: {
                jury_invities: true,
                jury_members: true,
            },
        });
    }

    async createDefenseDocument(
        projectId: number,
        body: createDefenseDocument,
    ) {
        return await this.prismaService.defenseDocument.create({
            data: {
                project_id: projectId,
                ...body,
            },
        });
    }

    async getProjectProgress(id: number) {
        return await this.prismaService.projectProgress.findMany({
            where: { project_id: id },
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async getDefenseDocument(projectId: number) {
        return await this.prismaService.defenseDocument.findUnique({
            where: { project_id: projectId },
        });
    }

    async createDefenseAuthorization(
        body: CreateDefenseAuthorizationDto,
        projectId: number,
        sub: number,
    ) {
        return await this.prismaService.defenseAuthorization.create({
            data: {
                ...body,
                project_id: projectId,
                supervisor_id: sub,
            },
        });
    }

    async createProjectProgress(
        body: CreateProjectProgressDto,
        projectId: number,
        sub: number,
    ) {
        return await this.prismaService.projectProgress.create({
            data: {
                ...body,
                project_id: projectId,
                user_id: sub,
            },
        });
    }

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
        try {
            return await this.prismaService.project.updateMany({
                where: { id: projectId, owner_id: userId },
                data: body,
            });
        } catch (error) {}
    }

    async getProjectPeriods() {
        return await this.prismaService.settings.findUnique({
            where: { tag: 'PROJECT_PERIODS' },
        });
    }

    async updateProjectPeriods(body: UpdateProjectPeriodsDto) {
        this.prismaService.settings.update({
            data: { value: body as unknown as Prisma.JsonValue },
            where: { tag: 'PROJECT_PERIODS' },
        });
    }

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

    async createTask(
        projectId: number,
        userId: number,
        createTaskDto: CreateTaskDto,
    ) {
        try {
            return await this.prismaService.projectTask.create({
                data: {
                    title: createTaskDto.title,
                    description: createTaskDto.description,
                    deadline: new Date(createTaskDto.deadline),
                    resources: createTaskDto.resources,
                    project_id: projectId,
                    user_id: userId,
                },
            });
        } catch (err) {
            throw new NotFoundException();
        }
    }
}
