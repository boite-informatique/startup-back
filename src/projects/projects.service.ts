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
import { CreateProjectDelibrationDto } from './dto/create-project-delibration.dto';
import { UpdateProjectDelibrationDto } from './dto/update-project-delibration.dto';
import { ProjectReserveDto } from './dto/project-reserve.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';
import { DefenseInviteInput } from './types/sendDefenseInviteInput.type';
import { MailerService } from '@nestjs-modules/mailer';
import Handlebars from 'handlebars';

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
                Delibration: {
                    include: {
                        evaluations: { include: { member: true } },
                        reservation: true,
                    },
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
                OR: [
                    { supervisors: { some: { id: userId } } },
                    { co_supervisor_id: userId },
                ],
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

    async getProjectsForJury(userId: number) {
        const projects = await this.prismaService.project.findMany({
            where: {
                DefensePlanification: {
                    OR: [
                        { jury_president_id: userId },
                        { jury_members: { some: { id: userId } } },
                        { jury_invities: { some: { id: userId } } },
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
    async createDelibration(
        projectId: number,
        body: CreateProjectDelibrationDto,
    ) {
        try {
            const delibration = await this.prismaService.delibration.create({
                data: {
                    project_id: projectId,
                    status: body.status,
                    evaluations: {
                        createMany: {
                            data: body.evaluations,
                        },
                    },
                },
            });

            return delibration;
        } catch (error) {
            throw new Error(error);
        }
    }
    async findAllDelibration() {
        try {
            return this.prismaService.delibration.findMany({
                include: { reservation: true, project: true },
            });
        } catch (error) {}
    }
    async findDelibration(id: number) {
        try {
            return this.prismaService.delibration.findUnique({
                where: { id },
                include: { reservation: true, project: true },
            });
        } catch (error) {}
    }
    async updateDelibration(
        id: number,
        updateDelibrationDto: UpdateProjectDelibrationDto,
    ) {
        try {
            return this.prismaService.delibration.update({
                where: { id },
                data: { status: updateDelibrationDto.status },
            });
        } catch (error) {}
    }
    async deleteDelibration(id: number) {
        try {
            return this.prismaService.delibration.delete({ where: { id } });
        } catch (error) {}
    }
    async findReserve(id: number) {
        return this.prismaService.projectReserve.findUnique({
            where: { project_id: id },
        });
    }
    async createReserve(id: number, body: ProjectReserveDto) {
        try {
            return this.prismaService.projectReserve.create({
                data: {
                    description: body.description,
                    Delibration: { connect: { id: body.delibration_id } },
                    project: { connect: { id } },
                },
            });
        } catch (error) {}
    }
    async deleteReserve(id: number) {
        try {
            return this.prismaService.projectReserve.delete({
                where: { id },
            });
        } catch (error) {}
    }

    async FindEvaluation(id: number) {
        try {
            return await this.prismaService.evaluation.findUnique({
                where: { id },
            });
        } catch (error) {}
    }
    async updateEvaluation(id: number, body: UpdateEvaluationDto) {
        try {
            return await this.prismaService.evaluation.update({
                where: { id },
                data: body,
            });
        } catch (error) {}
    }
    async deleteEvaluation(id: number) {
        try {
            return this.prismaService.evaluation.delete({
                where: { id },
            });
        } catch (error) {}
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

    async getDefenseReport(projectId: number) {
        const source = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Defense Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                }
        
                h1 {
                    text-align: center;
                    margin-bottom: 30px;
                }
        
                h2 {
                    margin-top: 40px;
                }
        
                h3 {
                    text-align: center;
                    margin-bottom: 20px;
                }
        
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
        
                th, td {
                    border: 1px solid #000;
                    padding: 10px;
                }
        
                th {
                    background-color: #f2f2f2;
                }
        
                ul {
                }
        
                .memberProject li,
                .supervisors li,
                .memberJury_list li,
                .guestsJury_list li {
                    margin-bottom: 5px;
                }
            </style>
        </head>
        <body>
        
            <h1>Project Defense Report</h1>
            <h3>{{dateDefense}}</h3>
        
            <h2>Project Details</h2>
            <table>
                <tr>
                    <th>Project Name</th>
                    <td>{{projectName}}</td>
                </tr>
                <tr>
                    <th>Project Type</th>
                    <td>{{projectType}}</td>
                </tr>
            </table>
        
            <h2>Project Members</h2>
            <table>
                <tr>
                    <th>Project Owner</th>
                    <td>{{projectOwner.first_name}} {{projectOwner.last_name}}</td>
                </tr>
                <tr>
                    <th>Project Members</th>
                    <td>
                        <ul class="memberProject">
                            {{#each memberProject}}
                                <li>{{this.first_name}} {{this.last_name}}</li>
                            {{/each}}
                        </ul>
                    </td>
                </tr>
            </table>
        
            <h2>Project Supervisors</h2>
            <table>
                <tr>
                    <th>Project Supervisors</th>
                    <td>
                        <ul class="supervisors">
                            {{#each supervisors}}
                                <li>{{this.first_name}} {{this.last_name}}</li>
                            {{/each}}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>Co-Supervisor</th>
                    <td>{{coSupervisor.first_name}} {{coSupervisor.last_name}}</td>
                </tr>
            </table>
        
            <h2>Defense Jury</h2>
            <table>
                <tr>
                    <th>Jury President</th>
                    <td>{{juryPresident.first_name}} {{juryPresident.last_name}}</td>
                </tr>
                <tr>
                    <th>Jury Members</th>
                    <td>
                        <ul class="memberJury_list">
                            {{#each memberJury}}
                                <li>{{this.first_name}} {{this.last_name}}</li>
                            {{/each}}
                        </ul>
                    </td>
                </tr>
                <tr>
                    <th>Guests</th>
                    <td>
                        <ul class="guestsJury_list">
                            {{#each guestsJury}}
                                <li>{{this.first_name}} {{this.last_name}}</li>
                            {{/each}}
                        </ul>
                    </td>
                </tr>
            </table>
        
            <h2>Evaluation Results</h2>
            <table>
                <tr>
                    <th>Member</th>
                    <th>Grade</th>
                    <th>Appreciation</th>
                </tr>
                {{#each evaluations}}
                    <tr>
                        <td>{{this.member.first_name}} {{this.member.last_name}}</td>
                        <td>{{this.note}}</td>
                        <td>{{this.appreciation}}</td>
                    </tr>
                {{/each}}
            </table>
        </body>
        </html>`;

        const project = await this.prismaService.project.findUnique({
            where: { id: projectId },
            include: {
                owner: true,
                members: true,
                supervisors: true,
                co_supervisor: true,
                Delibration: {
                    include: {
                        evaluations: {
                            include: {
                                member: true,
                            },
                        },
                    },
                },
            },
        });
        const defense =
            await this.prismaService.defensePlanification.findUnique({
                where: {
                    project_id: projectId,
                },
                include: {
                    president: true,
                    jury_invities: true,
                    jury_members: true,
                },
            });
        console.log();
        const template = Handlebars.compile(source);
        const data = {
            dateDefense: defense.date.toUTCString().substring(0, 16),
            projectName: project.product_name,
            projectType: project.type,
            projectOwner: project.owner,
            memberProject: project.members,
            supervisors: project.supervisors,
            coSupervisor: project.co_supervisor,
            juryPresident: defense.president,
            memberJury: defense.jury_members,
            guestsJury: defense.jury_invities,
            evaluations: project.Delibration.evaluations,
        };
        const result = template(data);
        return result;
    }

    async getDiploma(projectId: number, memberId: number) {
        const source = `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Diploma</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                    }
                    .diploma {
                        background-repeat: no-repeat;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 40px;
                        border: 2px solid #000;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
                        background-position: center;
                        background-color: rgba(0, 0, 0, 0.04);
                    }
        
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .algeria-text {
                        text-align: center;
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .ministry {
                        text-align: center;
                        font-size: large 20px;
                        font-weight: bold;
        
                        margin-bottom: 30px;
                    }
        
                    .title {
                        font-size: 30px;
                        font-weight: bold;
                        margin-bottom: 20px;
                    }
        
                    .subtitle {
                        font-size: 18px;
                        margin-bottom: 10px;
                    }
        
                    .recipient {
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 40px;
                        text-align: center;
                    }
        
                    .content {
                        margin-bottom: 40px;
                        text-align: justify;
                    }
        
                    .date {
                        margin-bottom: 10px;
                    }
                    .project {
                        font-weight: bold;
                    }
        
                    .signature {
                        text-align: right;
                    }
        
                    .signature img {
                        width: 180px;
                        height: auto;
                    }
        
                    .signature p {
                        margin: 5px 0;
                        font-weight: bold;
                    }
        
                    .footer {
                        font-size: 14px;
                        text-align: center;
                        margin-top: 30px;
                    }
                    p {
                        font-weight: 500;
                        font-size: medium;
                    }
                </style>
            </head>
            <body>
                <div class="diploma">
                    <div class="header">
                        <div class="algeria-text">
                            People's Democratic Republic of Algeria
                        </div>
                        <div class="ministry">
                            Ministry of Higher Education and Scientific Research
                        </div>
                        <div class="title">Defense Diploma</div>
                        <div class="subtitle">Awarded to</div>
                        <div class="recipient">{{recipient.first_name}} {{recipient.last_name}}</div>
                    </div>
                    <div class="content">
                        <p class="text">
                            This is to certify that
                            <span class="recipient">{{recipient.first_name}} {{recipient.last_name}}</span> has
                            successfully completed the project 
                            <span class="project">{{projectName}}</span>, as a  <span class="project">{{projectType}}</span> with the team <span class="project">{{brandName}}</span>.
                        </p>
                        <p>Presented on <span class="date">{{date}}</span>.</p>
                        <p>
                            Appreciation:
                            <span class="appreciation">{{appreciation}}</span>.
                        </p>
                    </div>
                    <div class="signature">
                        <img src="signature.png" alt="Signature" />
                        <p>Dr. {{juryPresident.first_name}} {{juryPresident.last_name}}</p>
                        <p>Jury President</p>
                    </div>
                    <div class="footer">&copy; {{year}}</div>
                </div>
            </body>
        </html>
        
        `;
        const project = await this.prismaService.project.findUnique({
            where: { id: projectId },
            include: {
                members: true,
                Delibration: {
                    include: {
                        evaluations: {
                            include: {
                                member: true,
                            },
                        },
                    },
                },
            },
        });
        const evaluation = project.Delibration.evaluations.find(
            (obj) => obj.member_id == memberId,
        );
        const defense =
            await this.prismaService.defensePlanification.findUnique({
                where: {
                    project_id: projectId,
                },
                include: {
                    president: true,
                },
            });
        const recipient = project.members.find(
            (member) => member.id == memberId,
        );
        const template = Handlebars.compile(source);
        const data = {
            recipient: recipient,
            projectName: project.product_name,
            projectType: project.type,
            brandName: project.brand_name,
            date: defense.date.toUTCString().substring(0, 16),
            juryPresident: defense.president,
            year: defense.date.getFullYear(),
            appreciation: evaluation.appreciation,
        };
        const result = template(data);
        return result;
    }
}
