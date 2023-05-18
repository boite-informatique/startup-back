import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(private readonly prismaService: PrismaService) {}

    async findOne(id: number) {
        const task = await this.prismaService.projectTask.findUnique({
            where: { id },
            include: { TaskFinished: true, comments: true, user: true },
        });

        if (task) return task;
        throw new NotFoundException();
    }
    async findataskComments(id: number) {
        const comments = await this.prismaService.projectTask
            .findUnique({
                where: { id },
            })
            .comments();
        if (comments.length > 0) return comments;
        throw new NotFoundException();
    }
    async update(id: number, updateTaskDto: UpdateTaskDto) {
        try {
            return await this.prismaService.projectTask.update({
                where: { id },
                data: updateTaskDto,
            });
        } catch (_) {
            throw new NotFoundException();
        }
    }

    async remove(id: number) {
        return await this.prismaService.projectTask.delete({ where: { id } });
    }
}
