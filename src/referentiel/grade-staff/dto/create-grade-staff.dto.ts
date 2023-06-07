import { IsString } from 'class-validator';

export class CreateGradeStaffDto {
    @IsString()
    name: string;
}
