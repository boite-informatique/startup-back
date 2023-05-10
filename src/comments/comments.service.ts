import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(createCommentDto: CreateCommentDto) {
        try {
            return await this.prismaService.comment.create({
                data: {
                    task: { connect: { id: createCommentDto.taskId } },
                    author: { connect: { id: createCommentDto.authorId } },
                    body: createCommentDto.body,
                },
            });
        } catch (_) {}
    }
    async update(id: number, updateCommentDto: UpdateCommentDto) {
        try {
            return await this.prismaService.comment.update({
                where: { id },
                data: updateCommentDto,
            });
        } catch (_) {
            throw new NotFoundException();
        }
    }
    async remove(id: number) {
        return await this.prismaService.comment.delete({ where: { id } });
    }
}
