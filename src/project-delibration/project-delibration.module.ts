import { Module } from '@nestjs/common';
import { ProjectDelibrationService } from './project-delibration.service';
import { ProjectDelibrationController } from './project-delibration.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [ProjectDelibrationController],
    providers: [ProjectDelibrationService],
    imports: [PrismaModule],
})
export class ProjectDelibrationModule {}
