import { PartialType } from '@nestjs/swagger';
import { CreateDefensePlanificationDto } from './create-defense-planification.dto';

export class UpdateDefencePlanificationDto extends PartialType(
    CreateDefensePlanificationDto,
) {}
