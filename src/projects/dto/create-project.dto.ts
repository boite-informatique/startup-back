import { ProjectType } from '@prisma/client';
import {
    ArrayMaxSize,
    ArrayNotEmpty,
    IsArray,
    IsEmail,
    IsIn,
    IsInt,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateProjectDto {
    @IsString()
    resume: string;

    @IsString()
    brand_name: string;

    @IsString()
    product_name: string;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsIn(['startup', 'patent'])
    type: ProjectType;

    @IsEmail({}, { each: true })
    @ArrayMaxSize(6)
    members: string[];

    @IsEmail({}, { each: true })
    @ArrayNotEmpty()
    @ArrayMaxSize(3)
    supervisors: string[];
}
