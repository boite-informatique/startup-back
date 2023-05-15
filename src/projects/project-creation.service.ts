import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { projectInviteInput } from './types/sendProjectInvite.type';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class ProjectCreationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailerService,
    ) {}

    async createProject(user: any, body: CreateProjectDto) {
        const alreadyRegisteredMembers = await this.getNewProjectMembers(
            body.members,
        );
        alreadyRegisteredMembers.push(user.email);
        const alreadyRegisteredSupervisors =
            await this.getNewProjectSupervisors(body.supervisors);

        if (user.type == 'student') {
            if (body.members.length > 5)
                throw new BadRequestException(
                    'Project members cannot be more than 6',
                );
            if (
                (await this.prismaService.project.count({
                    where: { members: { some: { id: user.sub } } },
                })) > 0
            )
                throw new ConflictException(
                    'Students cannot have more than one project',
                );
        }

        if (user.type == 'staff') {
            throw new ForbiddenException('You cannot create projects');
        }

        const project = await this.createProjectQuery(user.sub, {
            ...body,
            members: alreadyRegisteredMembers,
            supervisors: alreadyRegisteredSupervisors,
        });

        for (const member of body.members) {
            if (!alreadyRegisteredMembers.includes(member)) {
                this.sendProjectInvite({
                    email: member,
                    projectId: project.id,
                    type: 'member',
                    project_brand: project.brand_name,
                });
            }
        }

        for (const supervisor of body.supervisors) {
            if (!alreadyRegisteredSupervisors.includes(supervisor)) {
                this.sendProjectInvite({
                    email: supervisor,
                    projectId: project.id,
                    type: 'supervisor',
                    project_brand: project.brand_name,
                });
            }
        }

        return project;
    }

    async createProjectQuery(ownerId: number, body: CreateProjectDto) {
        return await this.prismaService.project.create({
            data: {
                brand_name: body.brand_name,
                product_name: body.product_name,
                resume: body.resume,
                logo: body?.logo,
                type: body.type,
                owner: { connect: { id: ownerId } },
                members: {
                    connect:
                        body.members.length > 0
                            ? body.members.map((email) => ({ email }))
                            : undefined,
                },
                supervisors: {
                    connect:
                        body.supervisors.length > 0
                            ? body.supervisors.map((email) => ({ email }))
                            : undefined,
                },
            },
        });
    }

    async getNewProjectSupervisors(supervisorEmails: string[]) {
        const supervisors = await this.prismaService.user.findMany({
            where: { email: { in: supervisorEmails } },
            select: {
                id: true,
                email: true,
                type: true,
            },
        });

        const nonTeachersupervisors: string[] = [];
        for (const supervisor of supervisors) {
            if (supervisor.type != 'teacher')
                nonTeachersupervisors.push(supervisor.email);
        }

        if (nonTeachersupervisors.length > 0)
            throw new ConflictException({ nonTeachersupervisors });
        return supervisors.map((val) => val.email);
    }

    async getNewProjectMembers(memberEmails: string[]) {
        const members = await this.prismaService.user.findMany({
            where: { email: { in: memberEmails } },
            select: {
                id: true,
                email: true,
                type: true,
                member_in_projects: true,
            },
        });
        const conflictedMembers: string[] = []; // members that are already in a project
        const nonStudentMembers: string[] = [];
        for (const member of members) {
            if (member.member_in_projects.length > 0)
                conflictedMembers.push(member.email);
            if (member.type != 'student') nonStudentMembers.push(member.email);
        }

        if (conflictedMembers.length > 0 || nonStudentMembers.length > 0)
            throw new ConflictException({
                conflictedMembers,
                nonStudentMembers,
            });
        return members.map((val) => val.email);
    }

    async sendProjectInvite({
        email,
        projectId,
        type,
        project_brand,
    }: projectInviteInput) {
        const invite = await this.prismaService.projectInvitees.create({
            data: {
                email,
                type,
                token: Math.random().toString(36).slice(-8),
                project: { connect: { id: projectId } },
            },
        });

        await this.mailService.sendMail({
            to: invite.email,
            subject: 'You have been invited to a project',
            text: `You are invited to join a project (${project_brand}) as a ${invite.type}, visit this link to register an account http://localhost:5173/register?invitation=true&email=${invite.email}&projectId=${invite.project_id}&type=${invite.type}&token=${invite.token}`,
        });
    }
}
