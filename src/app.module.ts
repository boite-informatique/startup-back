import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { JwtAuthGuard } from './auth/jwt-auth/jwt-auth.guard';
import { IamModule } from './iam/iam.module';

@Module({
    imports: [UsersModule, AuthModule, PermissionsModule, RolesModule, IamModule],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
