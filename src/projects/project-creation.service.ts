import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectCreationService {
    constructor(private readonly prismaService: PrismaService) {}

    async createProject(user: any, body: CreateProjectDto) {
        const newMembers = this.getNewProjectMembers(body.members);
        const newSupervisors = this.getNewProjectSupervisors(body.supervisors);

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

        const [project] = await this.prismaService.$transaction([
            this.createProjectQuery(user.sub, {
                members: newMembers,
                supervisors: newSupervisors,
                ...body,
            }),
        ]);
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
        return supervisors;
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
        return members;
    }

    createProjectQuery(ownerId: number, body: CreateProjectDto) {
        return this.prismaService.project.create({
            data: {
                brand_name: body.brand_name,
                product_name: body.product_name,
                resume: body.resume,
                logo: body?.logo,
                type: body.type,
                owner: { connect: { id: ownerId } },
                members: { connect: body.members.map((email) => ({ email })) },
                supervisors: {
                    connect: body.supervisors.map((email) => ({ email })),
                },
            },
        });
    }

    saveMemberInvitesQuery(emails: string[]) {}
}
