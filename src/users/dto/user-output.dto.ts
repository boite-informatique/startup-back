import { UserType } from '@prisma/client';
import { Role } from 'src/roles/dto/role-output.dto';

export class UserOutput {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    type: UserType;
    activated: boolean;
    phone: string;
    avatar?: string;
}

export class UserOutputWithRelations extends UserOutput {
    teacher?: Teacher;
    student?: Student;
    staff?: Staff;
    roles: Role[];
}

class Teacher {
    id: number;
    registration_num: string;
    grade: string;
    specialty: string;
}

class Student {
    id: number;
    registration_num: string;
    filiere: string;
    specialty: string;
}

class Staff {
    grade: string;
}
