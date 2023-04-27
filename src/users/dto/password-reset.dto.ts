import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class EmailDto {
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    email: string;
}

export class ResetDto extends EmailDto {
    @IsString()
    token: string;

    @IsString()
    password: string;
}
