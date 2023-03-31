import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    // Generate mock data using the faker library
    function GenerateUser() {
        return {
            email: faker.internet.email(),
            password: faker.internet.password(),
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            middle_name: faker.name.middleName(),
            date_of_birth: faker.date.birthdate(),
            location_of_birth: faker.address.city(),
            sex: faker.helpers.arrayElement(['Male', 'Female']),
            type: faker.helpers.arrayElement(['Teacher', 'Student', 'Staff']),
        };
    }

    function GenerateUsers(num: number) {
        const users = [];
        for (let i = 0; i < num; i++) {
            users.push(GenerateUser());
        }
        return users;
    }
    const users = GenerateUsers(10);
    console.log(users);
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
