import {
    CACHE_MANAGER,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetDto } from './dto/password-reset.dto';

const FORGOT_PASSWORD_CACHE_KEY = 'forgetPassword:';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaServive: PrismaService,
        private readonly hashingService: HashingService,
        private readonly emailService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    async forgotPassword(email: string) {
        const user = await this.prismaServive.user.findUnique({
            where: { email },
        });
        if (!user) {
            // User not found
            return { message: 'User dont exist' };
        }
        // Generate a password reset token
        const resetToken = await this.generateResetToken(email);
        //send mail
        this.sendResetMail(user.email, resetToken);
        return { message: 'Reset email sent successfully' };
    }

    async resetPassword(resetDto: ResetDto) {
        const cachedToken = await this.cacheManager.get(
            FORGOT_PASSWORD_CACHE_KEY + resetDto.email,
        );
        if (!cachedToken) {
            throw new ForbiddenException('token expired');
        }
        try {
            if (cachedToken == resetDto.token) {
                await this.prismaServive.user.update({
                    where: { email: resetDto.email },
                    data: { password: resetDto.password },
                });
            }
            return { message: 'Password Updated' };
        } catch (e) {
            throw new NotFoundException();
        }
    }
    async generateResetToken(email: string): Promise<string> {
        const token = Math.random().toString(36).slice(-8);
        // Save token in cache with 15 minutes ttl

        const ttl = 15 * 60 * 1000;
        await this.cacheManager.set(
            FORGOT_PASSWORD_CACHE_KEY + email,
            token,
            ttl,
        );

        return token;
    }

    //////////////////
    async sendResetMail(email: string, Token: string) {
        const mailOptions = {
            from: 'cade47@ethereal.email',
            to: email,
            subject: 'Password reset',
            text: `Use this Link to reset your password: https://example/${Token}`,
        };

        return await this.emailService.sendMail(mailOptions);
    }
}
