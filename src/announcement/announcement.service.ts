import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll(admin: string, userId: number) {
        const datenow = new Date();
        const establishement = await this.prismaService.establishment.findFirst(
            {
                where: {
                    OR: [
                        { Student: { some: { id: userId } } },
                        { Teacher: { some: { id: userId } } },
                    ],
                },
                select: {
                    id: true,
                },
            },
        );
        if (admin == 'true') {
            return await this.prismaService.announcement.findMany();
        } else {
            return this.prismaService.announcement.findMany({
                where: {
                    AND: [
                        { dateEnd: { gte: datenow } },
                        { dateStart: { lte: datenow } },
                    ],
                    establishement: { some: { id: establishement.id } },
                },
            });
        }
    }

    async create(createAnnouncementDto: CreateAnnouncementDto) {
        return await this.prismaService.announcement.create({
            data: {
                ...createAnnouncementDto,
                establishement: {
                    connect:
                        createAnnouncementDto.establishement.length > 0
                            ? createAnnouncementDto.establishement.map(
                                  (establishementId) => ({
                                      id: establishementId,
                                  }),
                              )
                            : undefined,
                },
            },
        });
    }

    async findOne(id: number) {
        return await this.prismaService.announcement.findUnique({
            where: { id },
        });
    }

    async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto) {
        return await this.prismaService.announcement.update({
            where: { id },
            data: {
                ...updateAnnouncementDto,
                establishement: {
                    set:
                        updateAnnouncementDto.establishement?.length > 0
                            ? []
                            : undefined,
                    connect: updateAnnouncementDto.establishement?.map(
                        (establishementId) => ({
                            id: establishementId,
                        }),
                    ),
                },
            },
        });
    }

    async remove(id: number) {
        return this.prismaService.announcement.delete({
            where: { id },
        });
    }
}
