import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'src/common/constants';
import { JwtStrategy } from './jwt-auth/jwt.strategy';

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            global: true,
            secret: jwtSecret,
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [AuthService, PrismaService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
