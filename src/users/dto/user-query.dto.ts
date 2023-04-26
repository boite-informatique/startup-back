import { Max, IsIn, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserType } from '@prisma/client';
import { PartialType } from '@nestjs/swagger';

class UserQueryDtoDef {
    @IsString()
    first_name: string;

    @IsIn(['teacher', 'student', 'staff'])
    type?: UserType;

    @IsInt()
    @Type(() => Number)
    skip: number = 0;

    @IsInt()
    @Type(() => Number)
    @Max(100)
    @Min(1)
    take: number = 25;
}

export class UserQueryDto extends PartialType(UserQueryDtoDef) {}
