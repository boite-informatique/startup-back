import { Injectable, NotFoundException } from '@nestjs/common';
import { HashingService } from 'src/iam/hashing/hashing/hashing.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaServive: PrismaService,
        private readonly hashingService: HashingService,
    ) {}

    async findUsers(userQueryDto: UserQueryDto) {
        const users = await this.prismaServive.user.findMany({
            take: userQueryDto.take,
            skip: userQueryDto.skip,
            where: {
                first_name: {
                    contains: userQueryDto.first_name,
                    mode: 'insensitive',
                },
                type: { equals: userQueryDto.type },
                sex: { equals: userQueryDto.sex },
            },
            include: { roles: true, student: true, teacher: true },
        });
        if (users.length === 0) {
            throw new UserNotFoundException();
        }

        return users;
    }

    async findOne(id: number) {
        const user = await this.prismaServive.user.findUnique({
            where: { id },
            include: { student: true, teacher: true, roles: true },
        });
        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const { email, password, roles, activated } = updateUserDto;
        const user = await this.prismaServive.user.update({
            where: { id },
            data: {
                email,
                password: await this.hashingService.generate(password),
                roles: {
                    set: roles?.length > 0 ? [] : undefined,
                    connect: roles?.map((r) => ({ id: r })),
                },
                activated,
            },
        });
        return user;
    }

    async findUserRoles(userId: number) {
        const userRoles = await this.prismaServive.user
            .findUnique({ where: { id: userId } })
            .roles();

        if (userRoles == null || userRoles.length === 0) {
            throw new NotFoundException('Roles not found.');
        }

        return userRoles;
    }
}
