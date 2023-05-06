import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getProjects(user: any) {
        let projects = [];
        if (user.type == 'student') {
            projects = await this.prismaService.project.findMany({
                where: { members: { some: { id: user.sub } } },
                take: 1,
            });
        } else {
            projects = await this.prismaService.project.findMany({
                where: {
                    OR: {
                        owner_id: user.sub,
                        supervisors: { some: { id: user.sub } },
                    },
                },
            });
        }

        if (projects.length == 0)
            throw new NotFoundException('No projects found');
        return projects;
    }

    async createProject(user: any, body: CreateProjectDto) {
        if (user.type == 'student') {
            body.members.push(user.email);
            if (body.members.length > 6)
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

        console.log(body);

        return await this.prismaService.project.create({
            data: {
                brand_name: body.brand_name,
                product_name: body.product_name,
                resume: body.resume,
                logo: body?.logo,
                type: body.type,
                owner: { connect: { id: user.sub } },
                members: { connect: body.members.map((email) => ({ email })) },
                supervisors: {
                    connect: body.supervisors.map((email) => ({ email })),
                },
            },
        });
    }
}
