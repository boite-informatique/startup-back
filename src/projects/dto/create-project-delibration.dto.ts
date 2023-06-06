import { DelibrationStatus, ProjectReserve } from '@prisma/client';
import { IsInt, IsObject, IsString } from 'class-validator';
import e from 'express';
import { createDefenseDocument } from 'src/defense-doc/dto/create-defense-doc.dto';
import { MemberEvaluationDto } from './member-evaluation.dto';

export class CreateProjectDelibrationDto {
    @IsString()
    status: DelibrationStatus;

    @IsObject({ each: true })
    evaluations: MemberEvaluationDto[];
}
