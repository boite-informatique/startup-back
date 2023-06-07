import { PartialType } from '@nestjs/swagger';
import { CreateGradeTeacherDto } from './create-grade-teacher.dto';

export class UpdateGradeTeacherDto extends PartialType(CreateGradeTeacherDto) {}
