import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DefensePlanificationController } from './defense-planification.controller';
import { DefensePlanificationService } from './defense-planification.service';

@Module({
    controllers: [DefensePlanificationController],
    providers: [DefensePlanificationService],
    imports: [PrismaModule],
})
export class DefensePlanificationModule {}
