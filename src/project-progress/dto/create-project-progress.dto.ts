import { IsInt, IsString, Max, Min, min } from 'class-validator';
export class CreateProjectProgressDto {
    @IsInt()
    @Max(100)
    @Min(0)
    percentage: number;

    @IsString()
    note: string;
}
