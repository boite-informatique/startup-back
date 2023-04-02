import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService, PrismaService],
    exports: [UsersService],
    imports: [PermissionsModule],
})
export class UsersModule {}
