import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    providers: [HashingService, AuthenticationService],
    controllers: [AuthenticationController],
    exports: [HashingService],
    imports: [PrismaModule],
})
export class IamModule {}
