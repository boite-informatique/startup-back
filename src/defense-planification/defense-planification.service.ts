import { Injectable } from '@nestjs/common';
import { IsBooleanString } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDefencePlanificationDto } from './dto/update-defense-planification.dto';

@Injectable()
export class DefensePlanificationService {
    async deleteDefencePlanification(idDef: number) {
        return await this.prismaService.defensePlanification.delete({
            where: {
                id: idDef,
            },
        });
    }

    async getOneDefencePlanification(id: number) {
        return await this.prismaService.defensePlanification.findUnique({
            where: { id },
            include: {
                jury_invities: true,
                jury_members: true,
            },
        });
    }

    async updateDefencePlanification(
        body: UpdateDefencePlanificationDto,
        id: number,
    ) {
        return await this.prismaService.defensePlanification.update({
            where: {
                id,
            },
            data: {
                president: {
                    connect: { email: body.jury_president },
                },
                jury_members: {
                    set: body.jury_members?.length > 0 ? [] : undefined,
                    connect: body.jury_members?.map((email) => ({ email })),
                },
                jury_invities: {
                    set: body.jury_invities?.length > 0 ? [] : undefined,
                    connect: body.jury_invities?.map((email) => ({ email })),
                },
                location: body.location,
                date: body.date,
                mode: body.mode,
                nature: body.nature,
            },
            include: {
                jury_invities: true,
                jury_members: true,
            },
        });
    }

    async getDefencePlanification() {
        return await this.prismaService.defensePlanification.findMany({
            include: {
                jury_invities: true,
                jury_members: true,
            },
        });
    }
    constructor(private readonly prismaService: PrismaService) {}
}
