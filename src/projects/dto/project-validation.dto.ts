import {
    ProjectValidationDecision,
    ProjectValidationReservation,
} from '@prisma/client';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class ValidationDto {
    @IsIn(['favorable', 'unfavorable', 'accepted_with_reservation'])
    decision: ProjectValidationDecision;

    @IsOptional()
    @IsIn(['major', 'minor'])
    reservation?: ProjectValidationReservation;

    @IsString()
    note: string;
}
