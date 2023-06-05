import { PartialType } from '@nestjs/swagger';
import { MemberEvaluationDto } from './member-evaluation.dto';

export class UpdateEvaluationDto extends PartialType(MemberEvaluationDto) {}
