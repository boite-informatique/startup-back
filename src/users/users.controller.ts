import { Controller, Get, Body, Patch, Param, Query, Req} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findUsers(@Query() userQueryDto: UserQueryDto) {
        return await this.usersService.findUsers(userQueryDto);
    }
    
    @Get('me')
    async getCurrentUser(@Req() req) {
    
      return await this.usersService.findOne(+req.user.userId);
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
