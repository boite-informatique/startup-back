import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './dto/role-output.dto';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsGuard } from 'src/permissions/guards/permissions.guard';
import { RequirePermissions } from 'src/permissions/decorators/required-permissions.decorator';

@ApiTags('roles')
@UseGuards(PermissionsGuard)
@RequirePermissions('canManageAll')
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}
    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
        return await this.rolesService.createRole(createRoleDto);
    }
    @Get()
    async findAllRoles(): Promise<Role[]> {
        return await this.rolesService.findAllRoles();
    }
    @Get(':id')
    async findOneRole(@Param('id') id: string): Promise<Role> {
        return await this.rolesService.findOneRole(+id);
    }
    @Get('/:id/users')
    async findRoleUsers(@Param('id') id: string) {
        return await this.rolesService.findRoleUsers(+id);
    }
    @Get('/:id/permissions')
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
