

import {
    IsInt,
   
    IsString,
   
} from 'class-validator';

export class CreateRoleDto {
    @IsString()
    name: string;
    @IsInt({ each: true })
    users: any[];
    @IsInt({ each: true })
    permissions: any[];
}
