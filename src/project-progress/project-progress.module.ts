import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectProgressController } from './project-progress.controller';
import { ProjectProgressService } from './project-progress.service';

@Module({
    controllers: [ProjectProgressController],
    providers: [ProjectProgressService],
    imports: [PrismaModule],
})
export class ProjectProgressModule {}
