import { Module } from '@nestjs/common';
import { GradeTeacherService } from './grade-teacher.service';
import { GradeTeacherController } from './grade-teacher.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [GradeTeacherController],
    providers: [GradeTeacherService],
    imports: [PrismaModule],
})
export class GradeTeacherModule {}
