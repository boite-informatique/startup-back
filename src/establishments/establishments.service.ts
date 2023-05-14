import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstablishmentsService {
    constructor(private readonly prismaService: PrismaService) {}

    async getEstablishments(search: string) {
        return await this.prismaService.establishment.findMany({
            where: { name: { contains: search, mode: 'insensitive' } },
            take: 7,
        });
    }
}
