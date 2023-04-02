import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth/jwt-auth.guard';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
    imports: [UsersModule, AuthModule, PermissionsModule],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
