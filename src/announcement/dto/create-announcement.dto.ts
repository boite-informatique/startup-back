import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateAnnouncementDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDateString()
    dateStart: string;

    @IsDateString()
    dateEnd: string;

    @IsString()
    image: string;

    @IsInt({ each: true })
    establishement: number[];
}
