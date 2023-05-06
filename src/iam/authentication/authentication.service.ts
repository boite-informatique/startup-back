import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingService } from '../hashing/hashing.service';
import { loginOutputDto } from './dto/login-output.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly prismaServive: PrismaService,
        private readonly jwtService: JwtService,
        private readonly hashingService: HashingService,
    ) {}

    async login(loginDto: LoginDto): Promise<loginOutputDto> {
        const user = await this.prismaServive.user.findUnique({
            where: { email: loginDto.email },
        });

        if (
            !user ||
            !(await this.hashingService.verify(
                loginDto.password,
                user.password,
            ))
        ) {
            throw new UnauthorizedException('Email or Password incorrect');
        }

        if (!user.activated) {
            throw new ForbiddenException('Account is deactivated');
        }

        const token = await this.jwtService.signAsync({
            sub: user.id,
            type: user.type,
            email: user.email,
        });

        return { token };
    }
}
