import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { Public } from './jwt-auth/public-decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return await this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    testJwt(@Request() req) {
        return req.user;
    }
}
