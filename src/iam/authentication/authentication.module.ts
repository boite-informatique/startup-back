import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HashingService } from '../hashing/hashing.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
    providers: [AuthenticationService, JwtStrategy, HashingService],
    controllers: [AuthenticationController],
    imports: [
        PassportModule,
        PrismaModule,
        JwtModule.register({
            global: true,
            secret: 'test',
            signOptions: { expiresIn: '30d' },
        }),
    ],
})
export class AuthenticationModule {}
