import { Module } from '@nestjs/common';
import { FiliereService } from './filiere.service';
import { FiliereController } from './filiere.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    controllers: [FiliereController],
    providers: [FiliereService],
    imports: [PrismaModule],
})
export class FiliereModule {}
