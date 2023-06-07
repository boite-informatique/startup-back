import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGradeTeacherDto } from './dto/create-grade-teacher.dto';
import { UpdateGradeTeacherDto } from './dto/update-grade-teacher.dto';

@Injectable()
export class GradeTeacherService {
    constructor(private readonly prismaService: PrismaService) {}

    async createGradeTeacher(createGradeTeacherDto: CreateGradeTeacherDto) {
        return await this.prismaService.gradeTeacher.create({
            data: {
                ...createGradeTeacherDto,
            },
        });
    }
    async getAllGradeTeacher(search: string) {
        return await this.prismaService.gradeTeacher.findMany({
            where: { name: { contains: search, mode: 'insensitive' } },
        });
    }
    async getOneGradeTeacher(id: number) {
        return await this.prismaService.gradeTeacher.findUnique({
            where: {
                id,
            },
        });
    }
    async updateGradeTeacher(
        id: number,
        updateGradeTeacherDto: UpdateGradeTeacherDto,
    ) {
        return await this.prismaService.gradeTeacher.update({
            where: {
                id,
            },
            data: {
                ...updateGradeTeacherDto,
            },
        });
    }
    async deleteGradeTeacher(id: number) {
        return await this.prismaService.gradeTeacher.delete({
            where: {
                id,
            },
        });
    }
}
