import { Module } from '@nestjs/common';
import { ProjectDelibrationService } from './project-delibration.service';
import { ProjectDelibrationController } from './project-delibration.controller';

@Module({
  controllers: [ProjectDelibrationController],
  providers: [ProjectDelibrationService]
})
export class ProjectDelibrationModule {}
