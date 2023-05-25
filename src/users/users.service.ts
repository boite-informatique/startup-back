import {
    ConflictException,
    CACHE_MANAGER,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UserNotFoundException } from './exceptions/userNotFound.exception';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetDto } from './dto/password-reset.dto';
import { ActivateDto } from './dto/activate-account.dto';
import { StaffDto, StudentDto, TeacherDto } from './dto/user-types.dto.';

const FORGOT_PASSWORD_CACHE_KEY = 'forgetPassword:';
const ACTIVATE_CACHE_KEY = 'activate:';

@Injectable()
export class UsersService {
    constructor(
        private readonly prismaServive: PrismaService,
        private readonly hashingService: HashingService,
        private readonly emailService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async createUser(createUserDto: CreateUserDto) {
        const checkUser = await this.prismaServive.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (checkUser) {
            throw new ConflictException('Email already exists');
        }

        const user = await this.prismaServive.user.create({
            data: {
                email: createUserDto.email,
                password: await this.hashingService.generate(
                    createUserDto.password,
                ),
                first_name: createUserDto.first_name,
                last_name: createUserDto.last_name,
                date_of_birth: new Date(createUserDto.date_of_birth),
                type: createUserDto.type,
                phone: createUserDto.phone,
                avatar: createUserDto.avatar,
                student:
                    createUserDto.type == 'student'
                        ? { create: createUserDto.info as StudentDto }
                        : undefined,
                staff:
                    createUserDto.type == 'staff'
                        ? { create: createUserDto.info as StaffDto }
                        : undefined,
            },
        });

        return user;
    }

    async createAccountWithProjectInvite(createUserDto: CreateUserDto) {
        const user = await this.createUser(createUserDto);

        const invitation = await this.prismaServive.projectInvitees.findFirst({
            where: {
                email: user.email,
                token: createUserDto.invitation.token,
                project_id: createUserDto.invitation.projectId,
            },
        });

        if (invitation) {
            await this.prismaServive.projectInvitees.deleteMany({
                where: { email: user.email },
            });

            try {
                await this.prismaServive.project.update({
                    where: { id: invitation.project_id },
                    data: {
                        members: {
                            connect:
                                invitation.type == 'member'
                                    ? { id: user.id }
                                    : undefined,
                        },
                        supervisors: {
                            connect:
                                invitation.type == 'supervisor'
                                    ? { id: user.id }
                                    : undefined,
                        },
                        co_supervisor_id:
                            invitation.type == 'co_supervisor'
                                ? user.id
                                : undefined,
                    },
                });
            } finally {
            }
        }

        return user;
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
            include: {
                student: { include: { establishement: true } },
                teacher: { include: { establishement: true } },
                roles: true,
                staff: true,
            },
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
                    ...updateUserDto,
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

    async sendResetMail(email: string, Token: string) {
        const mailOptions = {
            from: 'cade47@ethereal.email',
            to: email,
            subject: 'Password reset',
            text: `Use this Link to reset your password: http://localhost:5173/change_password/${Token}?email=${email}`,
        };

        return await this.emailService.sendMail(mailOptions);
    }
    async generateActivateToken(email: string): Promise<string> {
        const token = Math.random().toString(36).slice(-8);
        // Save token in cache with 15 minutes ttl

        const ttl = 15 * 60 * 1000;
        await this.cacheManager.set(ACTIVATE_CACHE_KEY + email, token, ttl);

        return token;
    }

    async sendActivatedMail(email: string, Token: string) {
        const mailOptions = {
            from: 'Innovium <no-reply@innovium.dz>',
            to: email,
            subject: 'Activate Your Account',
            text: `Use this Link to activate ur account: http://localhost:5173/activate_account/${Token}?email=${email}`,
        };
        return await this.emailService.sendMail(mailOptions);
    }

    async activateReq(email: string) {
        const user = await this.prismaServive.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new NotFoundException();
        }
        const token = await this.generateActivateToken(email);
        this.sendActivatedMail(email, token);
        await this.cacheManager.set(
            FORGOT_PASSWORD_CACHE_KEY + email,
            token,
            15 * 60 * 1000,
        );
        return { message: 'Activate email sent successfully' };
    }
    async activateAcc(activateDto: ActivateDto) {
        const cachedToken = await this.cacheManager.get(
            FORGOT_PASSWORD_CACHE_KEY + activateDto.email,
        );

        if (!cachedToken) {
            throw new ForbiddenException('token expired');
        }
        try {
            if (cachedToken == activateDto.token) {
                await this.prismaServive.user.update({
                    where: { email: activateDto.email },
                    data: { activated: true },
                });
                return { message: 'Account activated' };
            } else {
                throw new ForbiddenException('token expired');
            }
        } catch (e) {
            throw new NotFoundException();
        }
    }
}
