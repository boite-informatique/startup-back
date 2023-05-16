import { DelibrationStatus, ProjectReserve } from '@prisma/client';

export class CreateProjectDelibrationDto {
    status: DelibrationStatus;
    reservation: ProjectReserve;
}
