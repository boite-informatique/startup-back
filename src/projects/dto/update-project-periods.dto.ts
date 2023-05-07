import { IsDate } from 'class-validator';

export class UpdateProjectPeriodsDto {
    @IsDate()
    submission: string;

    @IsDate()
    validation: string;

    @IsDate()
    appeal: string;

    @IsDate()
    appealValidation: string;

    @IsDate()
    end: string;
}
