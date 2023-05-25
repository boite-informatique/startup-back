import { IsString } from 'class-validator';

export class CreateGradeTeacherDto {
    @IsString()
    name: string;
}
