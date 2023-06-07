import { Injectable } from '@nestjs/common';
import { CreateProjectDelibrationDto } from './dto/create-project-delibration.dto';
import { UpdateProjectDelibrationDto } from './dto/update-project-delibration.dto';
import { PrismaService } from 'src/prisma/prisma.service';
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
                const delibration = await this.prismaService.delibration.create(
                    {
                        data: {
                            project: {
                                connect: {
                                    id: createProjectDelibrationDto.projectId,
                                },
                            },
                            status: createProjectDelibrationDto.status,
                        },
                    },
                );
                const reserve = await this.prismaService.projectReserve.create({
                    data: {
                        description:
                            createProjectDelibrationDto.reservation.description,
                        documents:
                            createProjectDelibrationDto.reservation.documents,
                        Delibration: { connect: { id: delibration.id } },
                        project: {
                            connect: {
                                id: createProjectDelibrationDto.projectId,
                            },
                        },
                    },
                });
                return await this.prismaService.delibration.update({
                    where: { id: delibration.id },
                    data: { reservation: { connect: { id: reserve.id } } },
                });
            } else {
                return await this.prismaService.delibration.create({
                    data: {
                        project: {
                            connect: {
                                id: createProjectDelibrationDto.projectId,
                            },
                        },
                        status: createProjectDelibrationDto.status,
                    },
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }
    async findAllDelibration() {
        try {
            return this.prismaService.delibration.findMany({
                include: { reservation: true, project: true },
            });
        } catch (error) {}
    }
    async findDelibration(id: number) {
        try {
            return this.prismaService.delibration.findUnique({
                where: { id },
                include: { reservation: true, project: true },
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
    async findReserve(id: number) {
        return this.prismaService.projectReserve.findUnique({
            where: { project_id: id },
        });
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

    async FindEvaluation(id: number) {
        try {
            return await this.prismaService.evaluation.findUnique({
                where: { id },
            });
        } catch (error) {}
    }
    async updateEvaluation(id: number, body: UpdateEvaluationDto) {
        try {
            return await this.prismaService.evaluation.update({
                where: { id },
                data: body,
            });
        } catch (error) {}
    }
    async deleteEvaluation(id: number) {
        try {
            return this.prismaService.evaluation.delete({
                where: { id },
            });
        } catch (error) {}
    }
}
