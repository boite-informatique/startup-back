import { Type } from 'class-transformer';
import { IsDateString, ValidateNested } from 'class-validator';

export class Period {
    @IsDateString()
    start: string;

    @IsDateString()
    end: string;
}

export class UpdateProjectPeriodsDto {
    @Type(() => Period)
    @ValidateNested()
    submission: Period;

    @Type(() => Period)
    @ValidateNested()
    validation: Period;

    @Type(() => Period)
    @ValidateNested()
    appeal: Period;

    @Type(() => Period)
    @ValidateNested()
    appealValidation: Period;
}
