import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { generateHash } from '../src/common/crypto';

const academicRanks = ['Assistant Professor', 'Professor', 'Lecturer'];
const domains = ['MI', 'ST', 'ECO'];
const prisma = new PrismaClient();
async function seedData(numRecords: number) {
    const pass = await generateHash('Pass123#');

    try {
        await prisma.permission.create({
            data: {
                name: 'canManageAll',
                roles: {
                    connectOrCreate: {
                        where: { name: 'admin' },
                        create: { name: 'admin' },
                    },
                },
            },
        });
    } catch (err) {}

    for (let i = 0; i < numRecords; i++) {
        await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: pass,
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                middle_name: faker.name.middleName(),
                date_of_birth: faker.date.birthdate(),
                location_of_birth: faker.address.city(),
                sex: faker.helpers.arrayElement(['Male', 'Female']),
                type: 'Teacher',
                teacher: {
                    create: {
                        academic_rank:
                            faker.helpers.arrayElement(academicRanks),
                        domain: faker.helpers.arrayElement(domains),
                        establishement: faker.lorem.words(2),
                    },
                },
            },
        });
        await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: pass,
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                middle_name: faker.name.middleName(),
                date_of_birth: faker.date.birthdate(),
                location_of_birth: faker.address.city(),
                sex: faker.helpers.arrayElement(['Male', 'Female']),
                type: 'Student',
                student: {
                    create: {
                        domain: faker.helpers.arrayElement(domains),
                        establishement: faker.lorem.words(2),
                        departement: faker.lorem.words(2),
                        faculty: faker.lorem.words(2),
                        filiere: faker.lorem.words(2),
                        level: faker.datatype.number({ min: 1, max: 5 }),
                        section: faker.random.alpha({
                            casing: 'upper',
                            count: 1,
                        }),
                        group: faker.datatype.number({ min: 1, max: 20 }),
                    },
                },
            },
        });
    }
}
seedData(10);