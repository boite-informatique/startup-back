import { PartialType } from '@nestjs/swagger';
import { CreateProjectDelibrationDto } from './create-project-delibration.dto';

export class UpdateProjectDelibrationDto extends PartialType(
    CreateProjectDelibrationDto,
) {}
