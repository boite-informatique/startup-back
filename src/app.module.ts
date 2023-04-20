import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { IamModule } from './iam/iam.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './iam/authentication/guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/email.config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
    imports: [
        UsersModule,
        PermissionsModule,
        RolesModule,
        IamModule,
        PrismaModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [emailConfig],
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                transport: configService.get('email.transport'),
                defaults: '"Innovium" <noreply@innovium.dz>',
                preview: true,
            }),
        }),
    ],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
