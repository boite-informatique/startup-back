import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAllPermissions() {
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

    async checkUserPermission(userId: number, permissionName: string) {
        const permissions = await this.findUserPermissions(userId);

        return permissions.some((perm) => perm.name == permissionName);
    }
}
