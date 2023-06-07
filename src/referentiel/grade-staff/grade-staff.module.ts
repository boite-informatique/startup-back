import { Module } from '@nestjs/common';
import { GradeStaffService } from './grade-staff.service';
import { GradeStaffController } from './grade-staff.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [GradeStaffController],
    providers: [GradeStaffService],
    imports: [PrismaModule],
})
export class GradeStaffModule {}
