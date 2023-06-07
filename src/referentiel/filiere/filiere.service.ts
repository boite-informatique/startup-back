import { Injectable } from '@nestjs/common';
import { CreateFiliereDto } from './dto/create-filiere.dto';
import { UpdateFiliereDto } from './dto/update-filiere.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FiliereService {
    constructor(private readonly prismaService: PrismaService) {}

    async createFiliere(createFiliereDto: CreateFiliereDto) {
        return await this.prismaService.filiere.create({
            data: {
                ...createFiliereDto,
            },
        });
    }

    async getAllFiliere(search: string) {
        return await this.prismaService.filiere.findMany({
            where: { name: { contains: search, mode: 'insensitive' } },
        });
    }

    async getOneFiliere(id: number) {
        return await this.prismaService.filiere.findUnique({
            where: {
                id,
            },
        });
    }

    async updateFiliere(id: number, updateFiliereDto: UpdateFiliereDto) {
        return await this.prismaService.filiere.update({
            where: {
                id,
            },
            data: {
                ...updateFiliereDto,
            },
        });
    }

    async deleteFiliere(id: number) {
        return await this.prismaService.filiere.delete({
            where: {
                id,
            },
        });
    }
}
