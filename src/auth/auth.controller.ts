import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    Get,
    HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { Public } from './jwt-auth/public-decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
        return await this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    testJwt(@Request() req) {
        return req.user;
    }
}
