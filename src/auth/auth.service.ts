import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { UserQueryDto } from '../users/dto/user-query.dto';
import { UserNotFoundException } from '../users/exceptions/userNotFound.exception';

@Injectable()
export class AuthService {
    constructor(private readonly prismaServive: PrismaService) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.findOne(email);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async findOne(email: string) {
        const user = await this.prismaServive.user.findUnique({
            where: { email },
        });

        return user;
    }
}
