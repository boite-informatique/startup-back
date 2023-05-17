import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends OmitType(PartialType(CreateUserDto), [
    'info',
    'type',
    'invitation',
]) {
    @IsOptional()
    projects: any[];

    @IsOptional()
    roles: any[];

    @IsOptional()
    @IsBoolean()
    activated: boolean;
}
