import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { threadId } from 'worker_threads';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaServive: PrismaService,
        private readonly hashingService: HashingService,
    ) {}
    async createUser(createUserDto: CreateUserDto) {
        const {
            email,
            password,
            first_name,
            last_name,
            date_of_birth,
            type,
            info,
            phone,
        } = createUserDto;

        try {
            let user: User;
            switch (type) {
                case 'student': {
                    user = await this.prismaServive.user.create({
                        data: {
                            email,
                            password: password
                                ? await this.hashingService.generate(password)
                                : undefined,
                            first_name,
                            last_name,
                            date_of_birth,
                            type,
                            phone,
                            student: { create: info },
                        },
                    });
                    break;
                }
                case 'teacher': {
                    user = await this.prismaServive.user.create({
                        data: {
                            email,
                            password: password
                                ? await this.hashingService.generate(password)
                                : undefined,
                            first_name,
                            last_name,
                            date_of_birth,
                            type,
                            phone,
                            teacher: { create: info },
                        },
                    });
                    break;
                }
                case 'staff': {
                    user = await this.prismaServive.user.create({
                        data: {
                            email,
                            password: password
                                ? await this.hashingService.generate(password)
                                : undefined,
                            first_name,
                            last_name,
                            date_of_birth,
                            type,
                            phone,
                            staff: { create: info },
                        },
                    });
                    break;
                }
            }

            return user;
        } catch (e) {
            throw new NotFoundException();
        }
    }
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
            },
            include: { roles: true, student: true, teacher: true, staff: true },
        });
        if (users.length === 0) {
            throw new UserNotFoundException();
        }

        return users;
    }

    async findOne(id: number) {
        const user = await this.prismaServive.user.findUnique({
            where: { id },
            include: { student: true, teacher: true, roles: true, staff: true },
        });
        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const { email, password, roles, activated } = updateUserDto;
        try {
            const user = await this.prismaServive.user.update({
                where: { id },
                data: {
                    email,
                    password: password
                        ? await this.hashingService.generate(password)
                        : undefined,
                    roles: {
                        set: roles?.length > 0 ? [] : undefined,
                        connect: roles?.map((r) => ({ id: r })),
                    },
                    activated,
                },
            });
            return user;
        } catch (e) {
            throw new NotFoundException();
        }
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

    async deleteUser(userId: number) {
        try {
            return await this.prismaServive.user.delete({
                where: { id: userId },
            });
        } catch (e) {
            throw new NotFoundException();
        }
    }
}
