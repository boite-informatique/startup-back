import { Prisma, PrismaClient } from '@prisma/client';
import { users } from './users';

const prisma = new PrismaClient();

async function main() {
    await prisma.settings.upsert({
        where: { tag: 'PROJECT_PERIODS' },

        update: {},

        create: {
            tag: 'PROJECT_PERIODS',
            value: {
                submission: { start: '2023-05-01', end: '2023-05-07' },
                validation: { start: '2023-05-08', end: '2023-05-14' },
                appeal: { start: '2023-05-15', end: '2023-05-21' },
                appealValidation: { start: '2023-05-22', end: '2023-05-28' },
            },
        },
    });

    await prisma.establishment.createMany({
        data: [
            { id: 1, name: 'esi sba' },
            { id: 2, name: 'medecine sba' },
            { id: 3, name: 'esi alger' },
        ],
    });

    await prisma.filiere.createMany({
        data: [
            { id: 1, name: 'SC' },
            { id: 2, name: 'CP' },
        ],
    });

    await prisma.speciality.createMany({
        data: [
            { id: 1, name: 'MI' },
            { id: 2, name: 'ST' },
            { id: 3, name: 'Medecine' },
        ],
    });

    await prisma.gradeTeacher.createMany({
        data: [
            { id: 1, name: 'Professor' },
            { id: 2, name: 'Assistant Professor' },
        ],
    });

    await prisma.gradeStaff.createMany({
        data: [
            { id: 1, name: 'Adminstrator' },
            { id: 2, name: 'Manager' },
        ],
    });

    await prisma.permission.createMany({
        data: [
            { id: 100, name: 'canManageAll' },
            { id: 101, name: 'sc' },
            { id: 102, name: 'rs' },
            { id: 103, name: 'incubator' },
        ],
    });

    await prisma.role.create({
        data: {
            id: 100,
            name: 'admin',
            permissions: { connect: [{ id: 100 }] },
        },
    });
    await prisma.role.create({
        data: {
            id: 101,
            name: 'scientific committee',
            permissions: { connect: [{ id: 101 }] },
        },
    });
    await prisma.role.create({
        data: {
            id: 102,
            name: 'responsable stage',
            permissions: { connect: [{ id: 102 }] },
        },
    });
    await prisma.role.create({
        data: {
            id: 103,
            name: 'incubator',
            permissions: { connect: [{ id: 103 }] },
        },
    });

    for (const user of users) {
        await prisma.user.create({
            data: user as any,
        });
    }

    await prisma.project.create({
        data: {
            brand_name: 'innovium',
            product_name: 'innovium ultra',
            resume: 'innovium ultra is a new product that will change the world',
            type: 'startup',
            owner: { connect: { email: 'owner@esi-sba.dz' } },
            supervisors: { connect: { email: 'supervisor@esi-sba.dz' } },
            members: {
                connect: [
                    { email: 'member1@esi-sba.dz' },
                    { email: 'member2@esi-sba.dz' },
                ],
            },
            logo: 'project-logo.jpg',
            validation: {
                create: {
                    decision: 'favorable',
                    note: 'good project',
                    validator: { connect: { email: 'sc@esi-sba.dz' } },
                },
            },
            history: {
                createMany: {
                    data: {
                        field: 'brand_name',
                        old_value: 'innoviumss',
                        new_value: 'innovium',
                    },
                },
            },

            DefenseAuthorization: {
                create: {
                    uploadedFile: 'defense-authorization.pdf',
                    supervisor: { connect: { email: 'supervisor@esi-sba.dz' } },
                },
            },
            DefenseDocument: {
                create: {
                    bmc: 'bmc.pdf',
                    label: 'label.pdf',
                    memoire: 'memoire.pdf',
                },
            },
            ProjectInvitees: {
                createMany: {
                    data: [
                        {
                            email: 'meminv1@esi-sba.dz',
                            type: 'member',
                            token: 'token11',
                        },
                        {
                            email: 'meminv2@esi-sba.dz',
                            type: 'member',
                            token: 'token11',
                        },
                        {
                            email: 'invsup1@esi-sba.dz',
                            type: 'co_supervisor',
                            token: 'token11',
                        },
                    ],
                },
            },
            ProjectProgress: {
                create: {
                    percentage: 50,
                    user: { connect: { email: 'supervisor@esi-sba.dz' } },
                    note: 'good progress',
                },
            },
        },
    });

    await prisma.announcement.create({
        data: {
            title: 'Training on the technical-economic study of entrepreneurial projects',
            image: 'annonce1.jpg',
            description:
                'Training on the technical-economic study as part of the planning of entrepreneurial projects',
            dateStart: new Date('2023-06-05'),
            dateEnd: new Date('2024-06-05'),
            establishement: { connect: { id: 1 } },
        },
    });

    await prisma.announcement.create({
        data: {
            title: 'Training on the technical-economic study of entrepreneurial projects',
            image: 'annonce1.jpg',
            description:
                'Training on the technical-economic study as part of the planning of entrepreneurial projects',
            dateStart: new Date('2023-06-05'),
            dateEnd: new Date('2024-06-05'),
            establishement: { connect: { id: 1 } },
        },
    });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })

    .catch(async (e) => {
        console.error(e);

        await prisma.$disconnect();

        process.exit(1);
    });

// import { PrismaClient } from '@prisma/client';
// import { faker } from '@faker-js/faker';

// const academicRanks = ['Assistant Professor', 'Professor', 'Lecturer'];
// const domains = ['MI', 'ST', 'ECO'];
// const prisma = new PrismaClient();
// async function seedData(numRecords: number) {
//     const pass = '$2b$10$2grmJNpdMlqCFkCWX11WvuYwe3PMZcNlA4P0ozVjt8iu0i./AIsIW'; // 'Pass123#' hashed
//     for (let i = 0; i < numRecords; i++) {
//         await prisma.user.create({
//             data: {
//                 email: faker.internet.email(),
//                 password: pass,
//                 first_name: faker.name.firstName(),
//                 last_name: faker.name.lastName(),
//                 middle_name: faker.name.middleName(),
//                 date_of_birth: faker.date.birthdate(),
//                 location_of_birth: faker.address.city(),
//                 sex: faker.helpers.arrayElement(['Male', 'Female']),
//                 type: 'Teacher',
//                 teacher: {
//                     create: {
//                         academic_rank:
//                             faker.helpers.arrayElement(academicRanks),
//                         domain: faker.helpers.arrayElement(domains),
//                         establishement: faker.lorem.words(2),
//                     },
//                 },
//             },
//         });
//         await prisma.user.create({
//             data: {
//                 email: faker.internet.email(),
//                 password: pass,
//                 first_name: faker.name.firstName(),
//                 last_name: faker.name.lastName(),
//                 middle_name: faker.name.middleName(),
//                 date_of_birth: faker.date.birthdate(),
//                 location_of_birth: faker.address.city(),
//                 sex: faker.helpers.arrayElement(['Male', 'Female']),
//                 type: 'Student',
//                 student: {
//                     create: {
//                         domain: faker.helpers.arrayElement(domains),
//                         establishement: faker.lorem.words(2),
//                         departement: faker.lorem.words(2),
//                         faculty: faker.lorem.words(2),
//                         filiere: faker.lorem.words(2),
//                         level: faker.datatype.number({ min: 1, max: 5 }),
//                         section: faker.random.alpha({
//                             casing: 'upper',
//                             count: 1,
//                         }),
//                         group: faker.datatype.number({ min: 1, max: 20 }),
//                     },
//                 },
//             },
//         });
//     }
// }
// seedData(10);
