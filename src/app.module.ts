import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { IamModule } from './iam/iam.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtAuthGuard } from './iam/authentication/guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import emailConfig from './config/email.config';
import { CacheModule } from '@nestjs/cache-manager';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { EstablishmentsModule } from './establishments/establishments.module';

@Module({
    imports: [
        UsersModule,
        PermissionsModule,
        RolesModule,
        IamModule,
        PrismaModule,
        CacheModule.register({ isGlobal: true }),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [emailConfig],
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: configService.get('email'),
                defaults: '"Innovium" <noreply@innovium.dz>',
                preview: true,
            }),
        }),
        ProjectsModule,
        TasksModule,
        EstablishmentsModule,
    ],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
