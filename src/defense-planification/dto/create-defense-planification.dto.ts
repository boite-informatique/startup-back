import { DefenseMode, DefenseNature } from '@prisma/client';
import { IsDateString, IsEmail, IsIn, IsInt, IsString } from 'class-validator';
export class CreateDefensePlanificationDto {
    @IsString()
    @IsEmail()
    jury_president: string;

    @IsString({ each: true })
    @IsEmail({}, { each: true })
    jury_members: string[];

    @IsString({ each: true })
    @IsEmail({}, { each: true })
    jury_invities: string[];

    @IsInt()
    establishement_id: number;

    @IsDateString()
    date: string;

    @IsIn(['onsite', 'online'])
    mode: DefenseMode;

    @IsIn(['public', 'private'])
    nature: DefenseNature;
}
