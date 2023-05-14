import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TasksFinishedService } from './tasks-finished.service';

@Module({
    controllers: [TasksController],
    providers: [TasksService, TasksFinishedService],
    imports: [PrismaModule],
})
export class TasksModule {}
