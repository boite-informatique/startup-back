import { Sexe, UserType } from '.prisma/client';
import { Role } from 'src/roles/dto/role-output.dto';

export class UserOutput {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    date_of_birth: Date;
    location_of_birth: string;
    sex: Sexe;
    type: UserType;
}

export class UserOutputWithRelations {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    date_of_birth: Date;
    location_of_birth: string;
    sex: Sexe;
    type: UserType;
    teacher?: Teacher;
    student?: Student;
    roles: Role[];
}

class Teacher {
    id: number;
    user_id: number;
    domain: string;
    academic_rank: string;
    establishement: string;
}

class Student {
    id: number;
    user_id: number;
    domain: string;
    establishement: string;
    faculty: string | null;
    departement: string;
    filiere: string;
    level: number;
    section: string;
    group: number;
}
