import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismaService } from 'src/prisma.service';
import { PermissionsService } from 'src/permissions/permissions.service';

@Module({
    controllers: [RolesController],
    providers: [RolesService, PrismaService, PermissionsService],
})
export class RolesModule {}
