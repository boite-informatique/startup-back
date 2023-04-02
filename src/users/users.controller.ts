import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Query,
    Req,
    NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsService } from 'src/permissions/permissions.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly permissionService: PermissionsService,
    ) {}

    @Get()
    async findUsers(@Query() userQueryDto: UserQueryDto) {
        return await this.usersService.findUsers(userQueryDto);
    }

    @Get('permissions')
    async findCurrentUserPermissions(@Req() req) {
        const permissions = await this.permissionService.findUserPermissions(
            +req.user.userId,
        );

        if (permissions.length === 0) {
            throw new NotFoundException();
        }

        return permissions;
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.usersService.findOne(+id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return await this.usersService.update(+id, updateUserDto);
    }
}
