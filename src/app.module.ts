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
import { UploadModule } from './upload/upload.module';
import { DefenseDocModule } from './defense-doc/defense-doc.module';
import { ProjectProgressModule } from './project-progress/project-progress.module';
import { EstablishmentsModule } from './referentiel/establishments/establishments.module';
import { DefensePlanificationModule } from './defense-planification/defense-planification.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { FiliereModule } from './referentiel/filiere/filiere.module';
import { SpecialityModule } from './referentiel/speciality/speciality.module';
import { GradeStaffModule } from './referentiel/grade-staff/grade-staff.module';
import { GradeTeacherModule } from './referentiel/grade-teacher/grade-teacher.module';
import { ProjectDelibrationModule } from './project-delibration/project-delibration.module';

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
        UploadModule,
        DefenseDocModule,
        ProjectProgressModule,
        EstablishmentsModule,
        DefensePlanificationModule,
        AnnouncementModule,
        FiliereModule,
        SpecialityModule,
        GradeStaffModule,
        GradeTeacherModule,
        ProjectDelibrationModule,
    ],
    providers: [
        {
            provide: 'APP_GUARD',
            useClass: JwtAuthGuard,
        },
    ],
})
export class AppModule {}
