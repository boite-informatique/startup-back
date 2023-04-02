import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PermissionsService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll() {
        const permissions = await this.prismaService.permission.findMany();
        if (permissions.length === 0) {
            throw new NotFoundException();
        }

        return permissions;
    }

    async findUserPermissions(userId: number) {
        return await this.prismaService.permission.findMany({
            where: {
                roles: {
                    some: {
                        users: {
                            some: {
                                id: userId,
                            },
                        },
                    },
                },
            },
        });
    }
}
