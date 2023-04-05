import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { verifyHash } from 'src/common/crypto';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

type loginOutput = { token: string };

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaServive: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto): Promise<loginOutput> {
        const user = await this.findOne(loginDto.email);

        if (!user || !(await verifyHash(loginDto.password, user.password))) {
            throw new UnauthorizedException('Email or Password incorrect');
        }

        if (!user.activated) {
            throw new ForbiddenException('Account is deactivated');
        }

        const token = await this.jwtService.signAsync({ sub: user.id });

        return { token };
    }

    async findOne(email: string) {
        const user = await this.prismaServive.user.findUnique({
            where: { email },
        });

        return user;
    }
}
