import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [RolesController],
    providers: [RolesService, PermissionsService],
    imports: [PrismaModule],
})
export class RolesModule {}
