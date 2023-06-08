const password12346 =
    '$2b$10$/gcAxHw7RPXQQto4xuqAC.dsMmRPKabmin6.lO3WRG2oH6fbGxSYy';

export const users = [
    {
        email: 'owner@esi-sba.dz',
        password: password12346,
        first_name: 'mohamed',
        last_name: 'miloudi',
        date_of_birth: new Date('2002-03-19'),
        phone: '0557598040',
        type: 'student',
        activated: true,
        avatar: '',
        student: {
            create: {
                registration_num: 'es202036016498',
                establishment_id: 1,
                filiere_id: 1,
                speciality_id: 1,
            },
        },
    },
    {
        email: 'member1@esi-sba.dz',
        password: password12346,
        first_name: 'brahim',
        last_name: 'halloucha',
        date_of_birth: new Date('2002-03-19'),
        phone: '0557598040',
        type: 'student',
        activated: true,
        avatar: '',
        student: {
            create: {
                registration_num: 'es202036016498',
                establishment_id: 1,
                filiere_id: 1,
                speciality_id: 1,
            },
        },
    },
    {
        email: 'member2@esi-sba.dz',
        password: password12346,
        first_name: 'amine',
        last_name: 'benchaa',
        date_of_birth: new Date('2002-03-19'),
        phone: '0557598040',
        type: 'student',
        activated: true,
        avatar: '',
        student: {
            create: {
                registration_num: 'es202036016498',
                establishment_id: 1,
                filiere_id: 1,
                speciality_id: 1,
            },
        },
    },

    // teachers
    {
        email: 'supervisor@esi-sba.dz',
        password: password12346,
        first_name: 'mohamed',
        last_name: 'kechar',
        date_of_birth: new Date('1988-03-19'),
        phone: '0557598040',
        type: 'teacher',
        activated: true,
        avatar: '',
        teacher: {
            create: {
                registration_num: 'es202036016498',
                establishment_id: 1,
                grade_id: 1,
                speciality_id: 1,
            },
        },
    },

    {
        email: 'president@esi-sba.dz',
        password: password12346,
        first_name: 'abdelkader',
        last_name: 'kerhal',
        date_of_birth: new Date('1988-03-19'),
        phone: '0557598040',
        type: 'teacher',
        activated: true,
        avatar: '',
        teacher: {
            create: {
                registration_num: 'es202036016498',
                establishment_id: 1,
                grade_id: 1,
                speciality_id: 1,
            },
        },
    },

    // admin
    {
        email: 'admin@esi-sba.dz',
        password: password12346,
        first_name: 'fateh',
        last_name: 'benfateh',
        date_of_birth: new Date('1988-03-19'),
        phone: '0557598040',
        type: 'staff',
        activated: true,
        avatar: '',
        staff: {
            create: {
                grade_id: 1,
            },
        },
        roles: {
            connect: [{ id: 100 }],
        },
    },

    // scientific committee
    {
        email: 'sc@esi-sba.dz',
        password: password12346,
        first_name: 'mohamed',
        last_name: 'benslimane',
        date_of_birth: new Date('1988-03-19'),
        phone: '0557598040',
        type: 'teacher',
        activated: true,
        avatar: '',
        teacher: {
            create: {
                registration_num: 'es202036016498',
                establishment_id: 1,
                grade_id: 1,
                speciality_id: 1,
            },
        },
        roles: {
            connect: [{ id: 101 }],
        },
    },

    // responsable stage
    {
        email: 'rs@esi-sba.dz',
        password: password12346,
        first_name: 'oussama',
        last_name: 'serhane',
        date_of_birth: new Date('1988-03-19'),
        phone: '0557598040',
        type: 'teacher',
        activated: true,
        avatar: '',
        teacher: {
            create: {
                registration_num: 'es202036016498',
                establishment_id: 1,
                grade_id: 1,
                speciality_id: 1,
            },
        },
        roles: {
            connect: [{ id: 102 }],
        },
    },

    // incubator
    {
        email: 'incubator@esi-sba.dz',
        password: password12346,
        first_name: 'nesrine',
        last_name: 'lehireche',
        date_of_birth: new Date('1988-03-19'),
        phone: '0557598040',
        type: 'teacher',
        activated: true,
        avatar: '',
        teacher: {
            create: {
                registration_num: 'es202036016498',
                establishment_id: 1,
                grade_id: 1,
                speciality_id: 1,
            },
        },
        roles: {
            connect: [{ id: 103 }],
        },
    },
];
