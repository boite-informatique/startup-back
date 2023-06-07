import { IsString } from 'class-validator';

export class CreateFiliereDto {
    @IsString()
    name: string;
}
