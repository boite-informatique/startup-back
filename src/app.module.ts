import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { IamModule } from './iam/iam.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './iam/authentication/guards/jwt-auth.guard';

@Module({
    imports: [
        UsersModule,
        PermissionsModule,
        RolesModule,
        IamModule,
        PrismaModule,
    ],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
