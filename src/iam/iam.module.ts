import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing/hashing.service';

@Module({
    providers: [HashingService],
    exports: [HashingService],
})
export class IamModule {}
