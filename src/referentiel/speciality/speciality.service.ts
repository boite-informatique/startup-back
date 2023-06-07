import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';

@Injectable()
export class SpecialityService {
    constructor(private readonly prismaService: PrismaService) {}

    async createSpeciality(createSpecialityDto: CreateSpecialityDto) {
        return await this.prismaService.speciality.create({
            data: {
                ...createSpecialityDto,
            },
        });
    }

    async getAllSpecialities(search: string) {
        return await this.prismaService.speciality.findMany({
            where: { name: { contains: search, mode: 'insensitive' } },
        });
    }

    async getOneSpeciality(id: number) {
        return await this.prismaService.speciality.findUnique({
            where: {
                id,
            },
        });
    }

    async updateSpeciality(
        id: number,
        updateSpecialityDto: UpdateSpecialityDto,
    ) {
        return await this.prismaService.speciality.update({
            where: {
                id,
            },
            data: {
                ...updateSpecialityDto,
            },
        });
    }
    async deleteSpeciality(id: number) {
        return await this.prismaService.speciality.delete({
            where: {
                id,
            },
        });
    }
}
