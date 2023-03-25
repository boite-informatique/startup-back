import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception';

@Injectable()
export class UsersService {
    constructor(private readonly prismaServive: PrismaService) {}

    async findAll(): Promise<User[]> {
        const users = await this.prismaServive.user.findMany();
        if (!users) {
            throw new UserNotFoundException();
        }
        return users;
    }
    async findUsers(userQueryDto: UserQueryDto): Promise<User[]> {
        const users = await this.prismaServive.user.findMany({
            take: userQueryDto.take,
            skip: userQueryDto.skip,
            where: {
                first_name: { contains: userQueryDto.first_name },
                type: { equals: userQueryDto.type },
                sex: { equals: userQueryDto.sex },
            },
        });
        if (!users) {
            throw new UserNotFoundException();
        }

        return users;
    }

    async findOne(id: number): Promise<User> {
        const user = await this.prismaServive.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.prismaServive.user.update({
            where: { id },
            data: updateUserDto,
        });
        return user;
    }
}
