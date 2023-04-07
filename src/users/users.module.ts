import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
    imports: [PermissionsModule, PrismaModule],
})
export class UsersModule {}
