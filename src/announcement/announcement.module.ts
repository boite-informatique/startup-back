import { Module } from '@nestjs/common';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [AnnouncementController],
    providers: [AnnouncementService],
    imports: [PrismaModule],
})
export class AnnouncementModule {}
