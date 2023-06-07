import { Module } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { EstablishmentsController } from './establishments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [EstablishmentsController],
    providers: [EstablishmentsService],
    imports: [PrismaModule],
})
export class EstablishmentsModule {}
