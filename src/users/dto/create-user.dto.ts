import {
    IsDefined,
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { UserType } from '@prisma/client';
import { StaffDto, StudentDto, TeacherDto } from './user-types.dto.';
import { Type } from 'class-transformer';

export class InvitationDto {
    @IsInt()
    @IsDefined()
    projectId: number;
    @IsString()
    @IsDefined()
    token: string;
}

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
    @IsString()
    phone: string;
    @IsString()
    @IsOptional()
    avatar?: string;
    @Type(({ object }) => {
        if (object.type == 'student') return StudentDto;
        if (object.type == 'teacher') return TeacherDto;
        return StaffDto;
    })
    @ValidateNested()
    info: StudentDto | TeacherDto | StaffDto;

    @Type(() => InvitationDto)
    @ValidateNested()
    @IsOptional()
    invitation?: InvitationDto;
}
