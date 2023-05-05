import {
    Controller,
    Get,
    Body,
    Patch,
    Param,
    Query,
    Req,
    NotFoundException,
    ForbiddenException,
    Post,
    Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UserOutput, UserOutputWithRelations } from './dto/user-output.dto';
import { PermissionsOutput } from 'src/permissions/dto/permissions-output.dto';
import { Role } from 'src/roles/dto/role-output.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailDto, ResetDto } from './dto/password-reset.dto';
import { ActivateDto } from './dto/activate-account.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly permissionService: PermissionsService,
    ) {}

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.createUser(createUserDto);
    }
    @Get()
    async findUsers(
        @Query() userQueryDto: UserQueryDto,
    ): Promise<UserOutput[]> {
        return await this.usersService.findUsers(userQueryDto);
    }

    @Get('permissions')
    async findCurrentUserPermissions(@Req() req): Promise<PermissionsOutput[]> {
        const permissions = await this.permissionService.findUserPermissions(
            +req.user.userId,
        );

        if (permissions.length === 0) {
            throw new NotFoundException();
        }

        return permissions;
    }

    @Get('me')
    async getCurrentUser(@Req() req): Promise<UserOutputWithRelations> {
        return await this.usersService.findOne(+req.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<UserOutputWithRelations> {
        return await this.usersService.findOne(+id);
    }

    @Get(':id/roles')
    async findUserRoles(@Param('id') id: string): Promise<Role[]> {
        return await this.usersService.findUserRoles(+id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Req() req,
    ): Promise<UserOutput> {
        const userId: number = +req.user.userId;
        if (
            +id !== userId &&
            !(await this.permissionService.checkUserPermission(
                userId,
                'canManageAll',
            ))
        ) {
            throw new ForbiddenException();
        }
        return await this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.usersService.deleteUser(+id);
    }
    @Post('/forget-password')
    async forgotPassword(@Body() emailDto: EmailDto) {
        return await this.usersService.forgotPassword(emailDto.email);
    }
    @Patch('/reset-password')
    async updatePassword(@Body() resetDto: ResetDto) {
        return await this.usersService.resetPassword(resetDto);
    }
    @Post('/request-activation')
    async activateReq(@Body() emailDto: EmailDto) {
        return await this.usersService.activateReq(emailDto.email);
    }
    @Patch('/activate-account')
    async activateAcc(@Body() activateDto: ActivateDto) {
        return await this.usersService.activateAcc(activateDto);
    }
}
