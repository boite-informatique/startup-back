import {
    IsBoolean,
    IsEmail,
    IsInt,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsInt({ each: true })
    roles: any[];

    @IsBoolean()
    activated: boolean;
}
