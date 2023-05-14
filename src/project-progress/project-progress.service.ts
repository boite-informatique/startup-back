import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProjectProgressDto } from './dto/update-project-progess.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectProgressService {
    constructor(private readonly prismaService: PrismaService) {}

    async getProjectProgress() {
        return this.prismaService.projectProgress.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async update(
        id: number,
        updateProjectProgressDto: UpdateProjectProgressDto,
    ) {
        try {
            return await this.prismaService.projectProgress.update({
                where: { id },
                data: updateProjectProgressDto,
            });
        } catch (_) {
            throw new NotFoundException();
        }
    }

    async remove(id: number) {
        return await this.prismaService.projectProgress.delete({
            where: { id },
        });
    }
}
