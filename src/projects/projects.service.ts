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
        return await this.projectCreationService.createProject(user, body);
    }
}
