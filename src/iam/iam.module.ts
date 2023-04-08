import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
    providers: [HashingService],
    exports: [HashingService],
    imports: [PrismaModule, AuthenticationModule],
})
export class IamModule {}
