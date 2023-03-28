import { Injectable } from '@nestjs/common';
import { Role, User, Permission } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(private readonly prismaService: PrismaService) {}

    ///////////////////
 async createRole(data:CreateRoleDto):Promise<Role> {
    
   

        const role = await this.prismaService.role.create({
          data: {
         name : data.name
          },
        });
   return role;
}
    /////////////////////////////////////////////////////////
    async findAllRoles(): Promise<Role[]> {
        return await this.prismaService.role.findMany();
    }
    //////////////////////////////////////
      async findOneRole(id: number): Promise<Role>{

        return await this.prismaService.role.findUnique({where:{id},})
      }


    ////////////////////////
    async findRoleUsers(id: number): Promise<User[]> {
        return await this.prismaService.role
            .findUnique({ where: { id } })
            .users();
    }
    //////////////////////////////////////
    async findRolePermisions(id: number): Promise<Permission[]> {
        return await this.prismaService.role
            .findUnique({ where: { id } })
            .permissions();
    }
    ////////////////////////////////////////////////:
    async updateRole(id:number,data:UpdateRoleDto):Promise<Role> {
    
   

        const role = await this.prismaService.role.update({
            where:{id},
          data: {
         name : data.name
          },
        });
   return role;
}
    ////////////////////////////////////////////////:::
    async deleteRole(id: number) {
        return await this.prismaService.role.delete({
            where: { id },
        });
    }
}
