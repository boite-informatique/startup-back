import { IsInt, IsString } from 'class-validator';

export class ProjectReserveDto {
    @IsInt()
    delibration_id: number;
    @IsString()
    description: string;
}
