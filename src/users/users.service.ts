import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception'

@Injectable()
export class UsersService {
    constructor(private readonly prismaServive: PrismaService) {}

    async findAll() {
        return await this.prismaServive.user.findMany();
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
    }
}
