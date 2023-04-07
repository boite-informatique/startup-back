import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing/hashing.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';

@Module({
    providers: [HashingService, AuthenticationService],
    controllers: [AuthenticationController],
    exports: [HashingService],
})
export class IamModule {}
