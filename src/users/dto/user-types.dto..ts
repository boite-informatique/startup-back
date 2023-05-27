import { IsInt, IsString } from 'class-validator';

export class StudentDto {
    @IsString()
    registration_num: string;
    @IsString()
    filiere: string;
    @IsString()
    speciality: string;

    @IsInt()
    establishment_id: number;
}

export class TeacherDto {
    @IsString()
    registration_num: string;
    @IsString()
    grade: string;
    @IsString()
    speciality: string;

    @IsInt()
    establishment_id: number;
}

export class StaffDto {
    @IsString()
    grade: string;
}
