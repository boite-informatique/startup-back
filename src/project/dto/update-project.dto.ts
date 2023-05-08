import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-project.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
