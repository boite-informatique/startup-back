import { User, Permission } from '@prisma/client';
import { Type } from 'class-transformer';
import {CreateUserDto} from 'src/users/dto/create-user.dto'
import { CreatePermissionDto } from 'src/permissions/dto/create-permission.dto';
   
import {IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    /*@ValidateNested({ each: true })
    @Type(() => CreateUserDto)
    users: CreateUserDto[];
  
    @ValidateNested({ each: true })
    @Type(() => CreatePermissionDto)
    permissions: CreatePermissionDto[];*/
}
