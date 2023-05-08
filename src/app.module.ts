import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { JwtAuthGuard } from './auth/jwt-auth/jwt-auth.guard';
import { ProjectModule } from './project/project.module';
import { UploadModule } from './upload/upload.module';
import { ProjectModule } from './project/project.module';

@Module({
    imports: [UsersModule, AuthModule, PermissionsModule, RolesModule, ProjectModule, UploadModule],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
