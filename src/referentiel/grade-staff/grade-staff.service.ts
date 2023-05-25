import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGradeStaffDto } from './dto/create-grade-staff.dto';
import { UpdateGradeStaffDto } from './dto/update-grade-staff.dto';

@Injectable()
export class GradeStaffService {
    constructor(private readonly prismaService: PrismaService) {}

    async createGradeStaff(createGradeStaffDto: CreateGradeStaffDto) {
        return await this.prismaService.gradeStaff.create({
            data: {
                ...createGradeStaffDto,
            },
        });
    }
    async getAllGradeStaff() {
        return await this.prismaService.gradeStaff.findMany();
    }
    async getOneGradeStaff(id: number) {
        return await this.prismaService.gradeStaff.findUnique({
            where: { id },
        });
    }
    async updateGradeStaff(
        id: number,
        updateGradeStaffDto: UpdateGradeStaffDto,
    ) {
        return await this.prismaService.gradeStaff.update({
            where: {
                id,
            },
            data: {
                ...updateGradeStaffDto,
            },
        });
    }
    async deleteGradeStaff(id: number) {
        return await this.prismaService.gradeStaff.delete({
            where: { id },
        });
    }
}
