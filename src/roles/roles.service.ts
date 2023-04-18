import { Injectable } from '@nestjs/common';
import { Role, User, Permission } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(private readonly prismaService: PrismaService) {}

    async createRole(data: CreateRoleDto): Promise<Role> {
        const role = await this.prismaService.role.create({
            data: {
                name: data.name,
                users: { connect: data.users.map((u) => ({ id: u })) },
                permissions: {
                    connect: data.permissions.map((u) => ({ id: u })),
                },
            },
            include: { users: true, permissions: true },
        });
        return role;
    }

    async findAllRoles(): Promise<Role[]> {
        return await this.prismaService.role.findMany({
            include: { permissions: true, users: true },
        });
    }

    async findOneRole(id: number): Promise<Role> {
        return await this.prismaService.role.findUnique({
            where: { id },
            include: { permissions: true, users: true },
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

    async updateRole(id: number, data: UpdateRoleDto): Promise<Role> {
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
            include: { permissions: true, users: true },
        });
        return role;
    }

    async deleteRole(id: number) {
        return await this.prismaService.role.delete({
            where: { id },
        });
    }
}
