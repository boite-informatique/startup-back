import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    projects: any[];

    @IsOptional()
    roles: any[];

    @IsOptional()
    @IsBoolean()
    activated: boolean;
}
