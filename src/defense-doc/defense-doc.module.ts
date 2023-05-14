import { Module } from '@nestjs/common';
import { DefenseDocController } from './defense-doc.controller';
import { DefenseDocService } from './defense-doc.service';

@Module({
  controllers: [DefenseDocController],
  providers: [DefenseDocService]
})
export class DefenseDocModule {}
