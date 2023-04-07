import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { PermissionsGuard } from './guards/permissions.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [PermissionsController],
    providers: [PermissionsService, PermissionsGuard],
    exports: [PermissionsService],
    imports: [PrismaModule],
})
export class PermissionsModule {}
