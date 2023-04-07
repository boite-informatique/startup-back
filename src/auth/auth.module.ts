import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtSecret } from 'src/common/constants';
import { JwtStrategy } from './jwt-auth/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [
        PassportModule,
        PrismaModule,
        JwtModule.register({
            global: true,
            secret: jwtSecret,
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
