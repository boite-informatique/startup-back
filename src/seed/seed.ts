import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { generateHash } from 'src/common/crypto';

const prisma = new PrismaClient();
async function seedData(numRecords: number) {
    for (let i = 0; i < numRecords; i++) {
        const pass = generateHash('Pass123#');
        await prisma.user.create({
            data: {
                email: faker.internet.email(),
                password: await pass,
                first_name: faker.name.firstName(),
                last_name: faker.name.lastName(),
                middle_name: faker.name.middleName(),
                date_of_birth: faker.date.birthdate(),
                location_of_birth: faker.address.city(),
                sex: faker.helpers.arrayElement(['Male', 'Female']),
                type: faker.helpers.arrayElement([
                    'Teacher',
                    'Student',
                    'Staff',
                ]),
            },
        });
    }
    return console.log('sedding');
}
seedData(4);
