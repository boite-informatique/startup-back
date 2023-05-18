import { IsDateString } from 'class-validator';

export class UpdateProjectPeriodsDto {
    @IsDateString()
    submission: string;

    @IsDateString()
    validation: string;

    @IsDateString()
    appeal: string;

    @IsDateString()
    appealValidation: string;

    @IsDateString()
    end: string;
}
