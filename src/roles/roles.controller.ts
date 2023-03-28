import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '@prisma/client';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        return await this.rolesService.createRole(createRoleDto);
    }
    @Get()
    async findAllRoles() {
        return await this.rolesService.findAllRoles();
    }
    @Get(':id')
    async findOneRole(@Param('id') id: string) {
        return await this.rolesService.findOneRole(+id);
    }
    @Get('/users/:id')
    async findRoleUsers(@Param('id') id: string) {
        return await this.rolesService.findRoleUsers(+id);
    }
    @Get('/permisions/:id')
    async findRolePermisions(@Param('id') id: string) {
        return await this.rolesService.findRolePermisions(+id);
    }
    @Patch(':id')
    async updateRole(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        return await this.rolesService.updateRole(+id, updateRoleDto);
    }
    @Delete(':id')
    async deleteRole(@Param('id') id: string) {
        return await this.rolesService.deleteRole(+id);
    }
}
