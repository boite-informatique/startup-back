import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProjectDto {
@IsOptional()
@IsNotEmpty()
resume?: string;

@IsOptional()
@IsNotEmpty()
brand_name?: string;

@IsOptional()
@IsNotEmpty()
product_name?: string;

@IsOptional()
owner_id?: number;

@IsOptional()
supervisor_id?: number;

@IsOptional()
co_supervisor_id?: number;

@IsOptional()
memberIds?: number[];
}