import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-project.dto';

export class UpdateProjectDto extends PartialType(
    OmitType(CreateProjectDto, ['members', 'supervisors', 'co_supervisor']),
) {}
