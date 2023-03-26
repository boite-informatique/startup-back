import { Max, IsOptional, IsIn, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UserQueryDto {
    @IsOptional()
    first_name: string;

    @IsOptional()
    @IsIn(['Teacher', 'Student', 'Staff'])
    type?: 'Teacher' | 'Student' | 'Staff';

    @IsOptional()
    @IsIn(['Male', 'Female'])
    sex?: 'Male' | 'Female';

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    skip = 0;

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    @Max(100)
    @Min(1)
    take = 25;
}
