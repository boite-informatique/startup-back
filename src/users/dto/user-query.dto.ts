import { Optional } from '@nestjs/common';
import { IsEnum, Max } from 'class-validator';

export class UserQueryDto {
    @Optional()
    first_name?: string;
    @Optional()
    @IsEnum(['Teacher', 'Student', 'Stuff'], {
        message: 'type can be either Teacher,Student or Stuff',
    })
    type?: 'Teacher' | 'Student' | 'Stuff';
    @Optional()
    @IsEnum(['Male', 'Female'], { message: 'sex can be either Male or Female' })
    sex?: 'Male' | 'Female';
    @Optional()
    skip: number;
    @Optional()
    @Max(100)
    take: number;
}
