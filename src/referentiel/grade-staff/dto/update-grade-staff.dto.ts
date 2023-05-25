import { PartialType } from '@nestjs/swagger';
import { CreateGradeStaffDto } from './create-grade-staff.dto';

export class UpdateGradeStaffDto extends PartialType(CreateGradeStaffDto) {}
