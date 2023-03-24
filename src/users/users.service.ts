import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception';

@Injectable()
export class UsersService {
    constructor(private readonly prismaServive: PrismaService) {}

    async findAll() {
        const users = await this.prismaServive.user.findMany();
        if (!users) {
            throw new UserNotFoundException();
        }
        return users;
    }
    async findQuerry(userQueryDto: UserQueryDto) {
        const users = await this.prismaServive.user.findMany({
            take: userQueryDto.take,
            skip: userQueryDto.skip,
            where: {
                first_name: userQueryDto.first_name,
                type: userQueryDto.type,
                sex: userQueryDto.sex,
            },
        });
        return users;
    }

    async findOne(id: number) {
        const user = await this.prismaServive.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new UserNotFoundException();
        }

        return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.prismaServive.user.update({
            where: { id },
            data: updateUserDto,
        });
        return user;
    }
}
