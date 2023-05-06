import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjectCreationService } from './project-creation.service';

@Module({
    controllers: [ProjectsController],
    providers: [ProjectsService, ProjectCreationService],
    imports: [PrismaModule],
})
export class ProjectsModule {}
