import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
    @IsInt()
    projectId: number;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDateString()
    deadline: Date;

    @IsOptional()
    @IsString({ each: true })
    resources: string[];
}
