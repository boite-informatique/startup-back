import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createTaskDto: CreateTaskDto, userId: number) {
        try {
            return await this.prismaService.projectTask.create({
                data: {
                    title: createTaskDto.title,
                    description: createTaskDto.description,
                    deadline: createTaskDto.deadline,
                    resources: createTaskDto.resources,
                    project: { connect: { id: createTaskDto.projectId } },
                    user: { connect: { id: userId } },
                },
            });
        } catch (_) {}
    }

    async findOne(id: number) {
        const task = await this.prismaService.projectTask.findUnique({
            where: { id },
        });

        if (task) return task;
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
