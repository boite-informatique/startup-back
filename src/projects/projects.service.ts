import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getProjects(user: any) {
        let projects = [];
        if (user.type == 'student') {
            projects = await this.prismaService.project.findMany({
                where: { members: { some: { id: user.id } } },
                take: 1,
            });
        } else {
            projects = await this.prismaService.project.findMany({
                where: { OR: {} },
            });
        }
    }
}
