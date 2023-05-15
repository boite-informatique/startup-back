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
import { CreateDefensePlanificationDto } from 'src/defense-planification/dto/create-defense-planification.dto';

@Injectable()
export class ProjectsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly projectCreationService: ProjectCreationService,
    ) {}

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
                    jury_presedent: body.jury_presedent,
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

    async getDefenseDocument(projectId: number) {
        return await this.prismaService.defenseDocument.findUnique({
            where: { project_id: projectId },
        });
    }

    async createDefenseAuthorization(body: any, projectId: number, sub: any) {
        return await this.prismaService.defenseAuthorization.create({
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
            return await this.prismaService.projectValidation.create({
                data: {
                    ...body,
                    project: { connect: { id: projectId } },
                    validator: { connect: { id: userId } },
                },
            });
        } catch (error) {
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
            return await this.prismaService.projectTask.findMany({
                where: { project_id: projectId },
            });
        } catch (_) {
            throw new NotFoundException();
        }
    }
}
