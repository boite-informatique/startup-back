import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

describe('RolesService', () => {
    let rolesService: RolesService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RolesService, PrismaService],
        }).compile();

        rolesService = module.get<RolesService>(RolesService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('createRole', () => {
        it('should create a new role', async () => {
            const roleData: CreateRoleDto = {
                name: 'Admin',
                users: [1, 2],
                permissions: [3, 4],
            };
            const expectedResult = { id: 1, ...roleData };
            jest.spyOn(prismaService.role, 'create').mockResolvedValue(
                expectedResult,
            );

            const result = await rolesService.createRole(roleData);

            expect(prismaService.role.create).toHaveBeenCalledTimes(1);
            expect(prismaService.role.create).toHaveBeenCalledWith({
                data: {
                    name: roleData.name,
                    users: { connect: roleData.users.map((u) => ({ id: u })) },
                    permissions: {
                        connect: roleData.permissions.map((p) => ({ id: p })),
                    },
                },
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findAllRoles', () => {
        it('should return all roles', async () => {
            const expectedResult = [
                { id: 1, name: 'Admin', users: [], permissions: [] },
            ];
            jest.spyOn(prismaService.role, 'findMany').mockResolvedValue(
                expectedResult,
            );

            const result = await rolesService.findAllRoles();

            expect(prismaService.role.findMany).toHaveBeenCalledTimes(1);
            expect(prismaService.role.findMany).toHaveBeenCalledWith({
                include: { permissions: true },
            });
            expect(result).toEqual(expectedResult);
        });
    });

    describe('findOneRole', () => {
        it('should return a role with a given id', async () => {
            const roleId = 1;
            const expectedResult = {
                id: roleId,
                name: 'Admin',
                users: [],
                permissions: [],
            };
            jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(
                expectedResult,
            );

            const result = await rolesService.findOneRole(roleId);

            expect(prismaService.role.findUnique).toHaveBeenCalledTimes(1);
            expect(prismaService.role.findUnique).toHaveBeenCalledWith({
                where: { id: roleId },
            });
            expect(result).toEqual(expectedResult);
        });
    });
});
