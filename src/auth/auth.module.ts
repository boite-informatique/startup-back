import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService,PrismaService, LocalStrategy],
})
export class AuthModule {}
