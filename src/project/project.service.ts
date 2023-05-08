import { Injectable } from '@nestjs/common';
import { Role, User, Permission } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { CreateRoleDto } from './dto/create-project.dto';
import { UpdateRoleDto } from './dto/update-project.dto';


@Injectable()
export class ProjectService {
    constructor(private readonly prismaService: PrismaService) {}

    async createRole(data: CreateProjectDto): Promise<Role> {
        const role = await this.prismaService.role.create({
            data: {
                name: data.name,
                users: { connect: data.users.map((u) => ({ id: u })) },
                permissions: {
                    connect: data.permissions.map((u) => ({ id: u })),
                },
            },
        });
        return role;
    }
}
