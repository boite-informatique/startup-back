import { DelibrationStatus } from '@prisma/client';
import { IsObject, IsString } from 'class-validator';
import { MemberEvaluationDto } from './member-evaluation.dto';

export class CreateProjectDelibrationDto {
    @IsString()
    status: DelibrationStatus;

    @IsObject({ each: true })
    evaluations: MemberEvaluationDto[];
}
