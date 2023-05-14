import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTaskFinishedDto } from './create-task-finished.dto';

export class UpdateTaskFinishedDto extends PartialType(
    OmitType(CreateTaskFinishedDto, ['taskId']),
) {}
