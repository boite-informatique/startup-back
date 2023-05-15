import { DefenseMode, DefenseNature } from '@prisma/client';
import { IsDateString, IsIn, IsInt } from 'class-validator';
export class CreateDefensePlanificationDto {
    @IsInt()
    jury_presedent: number;

    @IsInt({ each: true })
    jury_members: number[];

    @IsInt({ each: true })
    jury_invities: number[];

    @IsInt()
    establishement_id: number;

    @IsDateString()
    date: string;

    @IsIn(['onsite', 'online'])
    mode: DefenseMode;

    @IsIn(['public', 'private'])
    nature: DefenseNature;
}
