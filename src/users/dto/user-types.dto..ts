import { IsInt, IsString } from 'class-validator';

export class StudentDto {
    @IsString()
    registration_num: string;
    @IsInt()
    filiere_id: number;
    @IsInt()
    specialty_id: number;

    @IsInt()
    establishment_id: number;
}

export class TeacherDto {
    @IsString()
    registration_num: string;
    @IsInt()
    grade_id: number;
    @IsInt()
    specialty_id: number;

    @IsInt()
    establishment_id: number;
}

export class StaffDto {
    @IsInt()
    grade_id: number;
}
