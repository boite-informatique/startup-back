import { Controller, Request, Post, Body, Get, HttpCode } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
    ) {}

    @ApiResponse({ status: 200, description: 'Authentication successful' })
    @ApiResponse({
        status: 401,
        description: 'Authentication failed, wrong credentials',
    })
    @ApiResponse({
        status: 403,
        description:
            'Authentication failed, right credentials but account deactivated',
    })
    @Public()
    @Post('login')
    @HttpCode(200)
    async login(@Body() loginDto: LoginDto) {
        return await this.authenticationService.login(loginDto);
    }

    @Get()
    testJwt(@Request() req) {
        return req.user;
    }
}
