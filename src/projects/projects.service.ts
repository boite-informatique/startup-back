import {
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
import { UpdateProjectDto } from './dto/update-project.dto';
import { createDefenseDocument } from 'src/defense-doc/dto/create-defense-doc.dto';
import { CreateProjectProgressDto } from 'src/project-progress/dto/create-project-progress.dto';
import { CreateDefensePlanificationDto } from 'src/defense-planification/dto/create-defense-planification.dto';
import { CreateDefenseAuthorizationDto } from './dto/create-defense-authorization.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { DefenseInviteInput } from './types/sendDefenseInviteInput.type';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ProjectsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly projectCreationService: ProjectCreationService,
        private readonly mailService: MailerService,
    ) {}

    async getProject(projectId: number) {
        const project = await this.prismaService.project.findUnique({
            where: {
                id: projectId,
            },
            include: {
                DefenseAuthorization: { include: { supervisor: true } },
                DefenseDocument: true,
                DefensePlanification: {
                    include: {
                        president: true,
                        jury_members: true,
                        jury_invities: true,
                        DefenseInvitees: true,
                    },
                },
                history: {
                    orderBy: { changed_at: 'desc' },
                },
                members: true,
                owner: true,
                ProjectInvitees: true,
                supervisors: true,
                co_supervisor: true,
                ProjectProgress: {
                    include: { user: true },
                    orderBy: { created_at: 'desc' },
                },
                ProjectTask: {
                    include: { user: true, TaskFinished: true },
                },
                validation: {
                    include: { validator: true },
                    orderBy: { created_at: 'desc' },
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

    async createDefensePlanifiacation(
        project_id: number,
        body: CreateDefensePlanificationDto,
    ) {
        const alreadyRegisteredPresident = await this.getNewPresident(
            body.jury_president,
        );
        const alreadyRegisteredMembers = await this.getNewDefenseMembers(
            body.jury_members,
        );
        const alreadyRegisteredInvitees = await this.getNewDefenseInvitees(
            body.jury_invities,
        );

        const defensePlanification = await this.createDefensePlanificationQuery(
            project_id,
            {
                ...body,
                jury_president: alreadyRegisteredPresident,
                jury_members: alreadyRegisteredMembers,
                jury_invities: alreadyRegisteredInvitees,
            },
        );

        for (const member of body.jury_members) {
            if (!alreadyRegisteredMembers.includes(member)) {
                this.sendDefenseInvitation({
                    email: member,
                    defensePlanId: defensePlanification.id,
                    type: 'member',
                });
            }
        }

        for (const invite of body.jury_invities) {
            if (!alreadyRegisteredInvitees.includes(invite)) {
                this.sendDefenseInvitation({
                    email: invite,
                    defensePlanId: defensePlanification.id,
                    type: 'invite',
                });
            }
        }

        if (alreadyRegisteredPresident !== body.jury_president) {
            this.sendDefenseInvitation({
                email: body.jury_president,
                defensePlanId: defensePlanification.id,
                type: 'president',
            });
        }

        return defensePlanification;
    }

    async getNewPresident(presidentEmail: string) {
        const president = await this.prismaService.user.findUnique({
            where: {
                email: presidentEmail,
            },
            select: {
                id: true,
                email: true,
                type: true,
            },
        });
        if (president) {
            if (president.type != 'teacher') {
                throw new ConflictException('the president must be a teacher');
            }

            return president.email;
        }
        return undefined;
    }
    async getNewDefenseMembers(memberEmails: string[]) {
        const members = await this.prismaService.user.findMany({
            where: {
                email: { in: memberEmails },
            },
            select: {
                id: true,
                email: true,
                type: true,
            },
        });
        const nonMembers: string[] = [];
        for (const member of members) {
            if (member.type != 'teacher') nonMembers.push(member.email);
        }

        if (nonMembers.length > 0) {
            throw new ConflictException('Jury members must be teachers');
        }
        return members.map((member) => member.email);
    }

    async getNewDefenseInvitees(inviteEmails: string[]) {
        const invitees = await this.prismaService.user.findMany({
            where: {
                email: { in: inviteEmails },
            },
            select: {
                id: true,
                email: true,
                type: true,
            },
        });
        const nonInvite: string[] = [];
        for (const invite of invitees) {
            if (invite.type != 'teacher') nonInvite.push(invite.email);
        }

        if (nonInvite.length > 0) {
            throw new ConflictException('Jury invitees must be teachers');
        }
        return invitees.map((invite) => invite.email);
    }

    async createDefensePlanificationQuery(
        projectId: number,
        body: CreateDefensePlanificationDto,
    ) {
        try {
            return await this.prismaService.defensePlanification.create({
                data: {
                    project: { connect: { id: projectId } },
                    jury_members: {
                        connect:
                            body.jury_members.length > 0
                                ? body.jury_members.map((email) => ({
                                      email,
                                  }))
                                : undefined,
                    },
                    jury_invities: {
                        connect:
                            body.jury_invities.length > 0
                                ? body.jury_invities.map((email) => ({
                                      email,
                                  }))
                                : undefined,
                    },
                    president: {
                        connect: body.jury_president
                            ? { email: body.jury_president }
                            : undefined,
                    },

                    location: body.location,
                    date: new Date(body.date),
                    mode: body.mode,
                    nature: body.nature,
                },
                include: {
                    jury_invities: true,
                    jury_members: true,
                    president: true,
                },
            });
        } catch (err) {
            console.log(err);
            throw new ConflictException(
                'This project already have a defense planification',
            );
        }
    }

    async sendDefenseInvitation({
        email,
        defensePlanId,
        type,
    }: DefenseInviteInput) {
        const invite = await this.prismaService.defenseInvitees.create({
            data: {
                email,
                type,
                defensePlanification: { connect: { id: defensePlanId } },
            },
        });

        await this.mailService.sendMail({
            to: invite.email,
            subject: 'You have been invited to a defense',
            text: `You are invited to join a defense as a ${invite.type}, visit this link to register an account http://localhost:5173/register?invitation=true&email=${invite.email}&defensePlanId=${invite.defensePlan_id}&type=${invite.type}`,
            html: `
            <body>
            <table width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" valign="top">
                  <table cellspacing="0" cellpadding="0" border="0" width="600">
                    <tr>
                      <td align="center" bgcolor="#f9f9f9" style="padding: 40px 0;">
                        <img src="https://i.ibb.co/0BP90Y1/innovium.png" alt="Logo" width="200" height="200" style="display: block;">
                        <p style="font-size: 18px; margin-top: 30px;">Hello, [Mr./Miss]</p>
                        <p style="font-size: 16px;">You are invited to join a defense as a <b>${invite.type}</b></p>
                        <p style="font-size: 16px;">Please visit this link to register an account</b></p>
                        <table cellspacing="0" cellpadding="0" border="0" style="margin-top: 30px;">
                          <tr>
                            <td align="center" style="border-radius: 3px;" bgcolor="#0F8388">
                              <a href="http://localhost:5173/register?invitation=true&email=${invite.email}&defensePlanId=${invite.defensePlan_id}&type=${invite.type}" target="_blank" style="font-size: 16px; font-weight: bold; text-decoration: none; color: #ffffff; display: inline-block; padding: 10px 20px;">Register</a>
                            </td>
                          </tr>
                        </table>
                        <p style="font-size: 16px;">Best regards,</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>`,
        });
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

    async getProjectsForOwnersOrMembers(userId: any) {
        const projects = await this.prismaService.project.findMany({
            where: {
                OR: [
                    { owner_id: userId },
                    { members: { some: { id: userId } } },
                ],
            },
            take: 1,
            include: {
                members: true,
                supervisors: true,
                validation: {
                    orderBy: { created_at: 'desc' },
                },
                owner: true,
                co_supervisor: true,
                ProjectProgress: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });

        if (projects.length == 0)
            throw new NotFoundException('No projects found');
        return projects;
    }

    async getProjectsForSupervisor(userId: number) {
        const projects = await this.prismaService.project.findMany({
            where: {
                supervisors: { some: { id: userId } },
            },
            include: {
                members: true,
                supervisors: true,
                validation: {
                    orderBy: { created_at: 'desc' },
                },
                owner: true,
                co_supervisor: true,
                ProjectProgress: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });

        if (projects.length == 0)
            throw new NotFoundException('No projects found');
        return projects;
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

        const projects = await this.prismaService.project.findMany({
            where: {
                owner: {
                    OR: [
                        { teacher: { establishment_id } },
                        { student: { establishment_id } },
                    ],
                },
            },
            include: {
                members: true,
                supervisors: true,
                validation: {
                    orderBy: { created_at: 'desc' },
                },
                owner: true,
                co_supervisor: true,
                ProjectProgress: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });
        if (projects.length == 0)
            throw new NotFoundException('No projects found');
        return projects;
    }

    async getProjectsForResponsableStage() {
        const projects = await this.prismaService.project.findMany({
            where: {
                validation: {
                    some: { decision: 'favorable' },
                },
                DefenseDocument: {
                    isNot: null,
                },
            },
            include: {
                members: true,
                supervisors: true,
                validation: {
                    orderBy: { created_at: 'desc' },
                },
                owner: true,
                co_supervisor: true,
                ProjectProgress: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });
        if (projects.length == 0)
            throw new NotFoundException('No projects found');
        return projects;
    }

    async createProject(user: any, body: CreateProjectDto) {
        return await this.projectCreationService.createProject(user, body);
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
        const project = await this.prismaService.project.findUnique({
            where: { id: projectId },
        });
        let updatedProject;
        try {
            updatedProject = await this.prismaService.project.updateMany({
                where: { id: projectId, owner_id: userId },
                data: body,
            });
        } catch (error) {
            throw new ForbiddenException(
                'Only project owners can modify this project',
            );
        }

        for (const property in body) {
            if (body[property] !== project[property]) {
                try {
                    console.log(
                        '[HISTORY TRY]',
                        property,
                        projectId,
                        body[property],
                        project[property],
                    );

                    const history = this.prismaService.projectHistory.create({
                        data: {
                            project_id: project.id,
                            field: property,
                            new_value: body[property],
                            old_value: project[property],
                        },
                    });
                    Promise.resolve(history);
                } catch (err) {
                    console.log('[HISTORY ERROR]', err);
                }
            }
        }
        return updatedProject;
    }

    async getProjectPeriods() {
        return (
            await this.prismaService.settings.findUnique({
                where: { tag: 'PROJECT_PERIODS' },
            })
        ).value;
    }

    async updateProjectPeriods(body: UpdateProjectPeriodsDto) {
        return (
            await this.prismaService.settings.update({
                data: { value: body as unknown as Prisma.JsonValue },
                where: { tag: 'PROJECT_PERIODS' },
            })
        ).value;
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
