import { DelibrationStatus, ProjectReserve } from '@prisma/client';
import { IsInt, IsObject, IsString } from 'class-validator';

export class CreateProjectDelibrationDto {
    @IsInt()
    projectId: number;
    @IsString()
    status: DelibrationStatus;
    @IsObject()
    reservation: ProjectReserve;
}
