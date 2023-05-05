import { IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class EmailDto {
    @IsString()
    @Transform(({ value }) => value.toLowerCase())
    email: string;
}
export class ActivateDto extends EmailDto {
    @IsString()
    token: string;
}
