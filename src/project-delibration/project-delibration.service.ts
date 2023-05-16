import { Injectable } from '@nestjs/common';
import { CreateProjectDelibrationDto } from './dto/create-project-delibration.dto';
import { UpdateProjectDelibrationDto } from './dto/update-project-delibration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { connect } from 'http2';
import { MemberEvaluationDto } from './dto/member-evaluation.dto';
import { ProjectReserveDto } from './dto/project-reserve.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class ProjectDelibrationService {
    constructor(private readonly prismaService: PrismaService) {}
    async createDelibration(
        createProjectDelibrationDto: CreateProjectDelibrationDto,
    ) {
        try {
            if (
                createProjectDelibrationDto.status ==
                'accepted_with_reservation'
            ) {
                const reserve = await this.prismaService.projectReserve.create({
                    data: createProjectDelibrationDto.reservation,
                });
                return await this.prismaService.delibration.create({
                    data: {
                        status: createProjectDelibrationDto.status,
                        reservation: { connect: { id: reserve.id } },
                    },
                });
            } else {
                return await this.prismaService.delibration.create({
                    data: { status: createProjectDelibrationDto.status },
                });
            }
        } catch (error) {}
    }
    async findDelibration(id: number) {
        try {
            return this.prismaService.delibration.findUnique({
                where: { id },
                include: { reservation: true },
            });
        } catch (error) {}
    }
    async updateDelibration(
        id: number,
        updateDelibrationDto: UpdateProjectDelibrationDto,
    ) {
        try {
            return this.prismaService.delibration.update({
                where: { id },
                data: { status: updateDelibrationDto.status },
            });
        } catch (error) {}
    }
    async deleteDelibration(id: number) {
        try {
            return this.prismaService.delibration.delete({ where: { id } });
        } catch (error) {}
    }
    async createReserve(id: number, body: ProjectReserveDto) {
        try {
            return this.prismaService.projectReserve.create({
                data: {
                    description: body.description,
                    Delibration: { connect: { id: body.delibration_id } },
                    project: { connect: { id } },
                },
            });
        } catch (error) {}
    }
    async deleteReserve(id: number) {
        try {
            return this.prismaService.projectReserve.delete({
                where: { id },
            });
        } catch (error) {}
    }
    async createEvaluation(memberEvaluation: MemberEvaluationDto) {
        try {
            return await this.prismaService.memberEvaluation.create({
                data: memberEvaluation,
            });
        } catch (error) {}
    }
    async FindEvaluation(id: number) {
        try {
            return await this.prismaService.memberEvaluation.findUnique({
                where: { id },
            });
        } catch (error) {}
    }
    async updateEvaluation(id: number, body: UpdateEvaluationDto) {
        try {
            return await this.prismaService.memberEvaluation.update({
                where: { id },
                data: body,
            });
        } catch (error) {}
    }
    async deleteEvaluation(id: number) {
        try {
            return this.prismaService.memberEvaluation.delete({
                where: { id },
            });
        } catch (error) {}
    }
}
