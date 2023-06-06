import { DefenseMode, DefenseNature } from '@prisma/client';
import {
    IsDateString,
    IsEmail,
    IsIn,
    IsOptional,
    IsString,
} from 'class-validator';
export class CreateDefensePlanificationDto {
    @IsEmail()
    jury_president: string;

    @IsEmail({}, { each: true })
    jury_members: string[];

    @IsEmail({}, { each: true })
    jury_invities: string[];

    @IsOptional()
    @IsString()
    location: string;

    @IsDateString()
    date: string;

    @IsIn(['onsite', 'online'])
    mode: DefenseMode;

    @IsIn(['public', 'private'])
    nature: DefenseNature;
}
