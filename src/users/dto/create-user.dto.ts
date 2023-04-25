import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    IsObject,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';
import { UserType } from '@prisma/client';

export class CreateUserDto {
    @IsEmail()
    email: string;
    @IsString()
    @MinLength(6)
    password: string;
    @IsString()
    first_name: string;
    @IsString()
    last_name: string;
    @IsString()
    date_of_birth: Date;
    @IsString()
    type: UserType;

    activated?: boolean;
    @IsString()
    phone: string;
    @IsString()
    @IsOptional()
    avatar?: string;
    @IsOptional()
    roles: any[];
    @IsOptional()
    info: any;
    @IsOptional()
    projects: any[];
}
