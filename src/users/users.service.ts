import { Injectable } from '@nestjs/common';
import { generateHash } from 'src/common/crypto';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception';

@Injectable()
export class UsersService {
    constructor(private readonly prismaServive: PrismaService) {}

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
        const { email, password, roles } = updateUserDto;
        const user = await this.prismaServive.user.update({
            where: { id },
            data: {
                email,
                password: await generateHash(password),
                roles: {
                    set: roles?.length > 0 ? [] : undefined,
                    connect: roles?.map((r) => ({ id: r })),
                },
            },
        });
        return user;
    }
}
