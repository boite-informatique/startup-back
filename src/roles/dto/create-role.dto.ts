import { User, Permission } from '@prisma/client';
import { Type } from 'class-transformer';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreatePermissionDto } from 'src/permissions/dto/create-permission.dto';

import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export class CreateRoleDto {
    @IsString()
    name: string;
    @IsInt({ each: true })
    users: any[];
    @IsInt({ each: true })
    permissions: any[];
}
