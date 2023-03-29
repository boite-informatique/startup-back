import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth/jwt-auth.guard';

@Module({
    imports: [UsersModule, AuthModule],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
