import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserQueryDto } from './dto/user-query.dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { UsersController } from './users.controller';

describe('UsersService', () => {
    let usersController: UsersController;
    let usersService: UsersService;
    let prismaService: PrismaService;

  
  const mockUser: User = {
    id: 1,
    email: 'johndoe@example.com',
    password: 'password',
    first_name:'John',
    last_name:'Doe',
    middle_name:"slim",
    date_of_birth:new Date(20/11/2002),
    location_of_birth:"Oran",
    sex:"Male",
    type:"Student"
   
  };
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    usersController = moduleRef.get<UsersController>(UsersController);
    usersService = moduleRef.get<UsersService>(UsersService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });


  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(usersService, 'findAll').mockResolvedValue([mockUser]);

      expect(await usersController.findAll()).toEqual([mockUser]);
    });
  });
////////////////////////////////////////////////////
describe('findUsers',() => {
it('should return an array of users', async () =>{
    const userQueryDto = new UserQueryDto();
      userQueryDto.take = 10;
      userQueryDto.skip = 0;
      userQueryDto.first_name = 'John';
      userQueryDto.type ='Student';
      userQueryDto.sex = 'Male';
      jest.spyOn(usersService,'findUsers').mockResolvedValue([mockUser]);
      expect(await usersController.findUsers(userQueryDto)).toEqual([mockUser]);
});
});
////////////////////////////////////////////////////
  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);

      expect(await usersController.findOne('1')).toEqual(mockUser);
    });
  });
  ////////////////////////////////////////////////////
  describe('update', () => {
    it('should update a user by id', async () => {
      jest.spyOn(usersService, 'update').mockResolvedValue(mockUser);

      expect(await usersController.update('1', mockUser)).toEqual(mockUser);
    });
  });
  
});
