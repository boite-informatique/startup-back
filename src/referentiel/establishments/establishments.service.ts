import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';

@Injectable()
export class EstablishmentsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getEstablishments(search: string) {
        return await this.prismaService.establishment.findMany({
            where: { name: { contains: search, mode: 'insensitive' } },
        });
    }

    async createEstablishment(createEstablishmentDto: CreateEstablishmentDto) {
        return await this.prismaService.establishment.create({
            data: {
                ...createEstablishmentDto,
            },
        });
    }

    async getAllEstablishment() {
        return await this.prismaService.establishment.findMany();
    }

    async getOneEstablishment(id: number) {
        return await this.prismaService.establishment.findUnique({
            where: {
                id,
            },
        });
    }

    async updateEstablishment(
        id: number,
        updateEstablishmentDto: UpdateEstablishmentDto,
    ) {
        return await this.prismaService.establishment.update({
            where: {
                id,
            },
            data: {
                ...updateEstablishmentDto,
            },
        });
    }

    async deleteEstablishment(id: number) {
        return await this.prismaService.establishment.delete({
            where: {
                id,
            },
        });
    }
}
