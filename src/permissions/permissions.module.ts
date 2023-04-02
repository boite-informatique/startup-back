import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PrismaService } from 'src/prisma.service';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
    controllers: [PermissionsController],
    providers: [PermissionsService, PrismaService, PermissionsGuard],
    exports: [PermissionsService],
})
export class PermissionsModule {}
