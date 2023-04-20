import { Injectable } from '@nestjs/common';
import { User, Permission } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleWithPermissionsAndUserCount } from './dto/role-output.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(private readonly prismaService: PrismaService) {}

    async createRole(
        data: CreateRoleDto,
    ): Promise<RoleWithPermissionsAndUserCount> {
        const role = await this.prismaService.role.create({
            data: {
                name: data.name,
                users: { connect: data.users.map((u) => ({ id: u })) },
                permissions: {
                    connect: data.permissions.map((u) => ({ id: u })),
                },
            },
            select: {
                id: true,
                name: true,
                permissions: true,
                users: true,
                _count: true,
            },
        });
        return role;
    }

    async findAllRoles(): Promise<RoleWithPermissionsAndUserCount[]> {
        return await this.prismaService.role.findMany({
            select: {
                id: true,
                name: true,
                permissions: true,
                users: true,
                _count: true,
            },
        });
    }

    async findOneRole(id: number): Promise<RoleWithPermissionsAndUserCount> {
        return await this.prismaService.role.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                permissions: true,
                users: true,
                _count: true,
            },
        });
    }

    async findRoleUsers(id: number): Promise<User[]> {
        return await this.prismaService.role
            .findUnique({ where: { id } })
            .users();
    }

    async findRolePermisions(id: number): Promise<Permission[]> {
        return await this.prismaService.role
            .findUnique({ where: { id } })
            .permissions();
    }

    async updateRole(
        id: number,
        data: UpdateRoleDto,
    ): Promise<RoleWithPermissionsAndUserCount> {
        const role = await this.prismaService.role.update({
            where: { id },
            data: {
                name: data.name,
                users: {
                    set: data.users?.length > 0 ? [] : undefined,
                    connect: data.users?.map((u) => ({ id: u })),
                },
                permissions: {
                    set: data.permissions?.length > 0 ? [] : undefined,
                    connect: data.permissions?.map((u) => ({ id: u })),
                },
            },
            select: {
                id: true,
                name: true,
                permissions: true,
                users: true,
                _count: true,
            },
        });
        return role;
    }

    async deleteRole(id: number) {
        return await this.prismaService.role.delete({
            where: { id },
        });
    }
}
