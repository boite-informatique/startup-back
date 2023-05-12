import { IsString } from 'class-validator';
export class createDefenseDocument {
    @IsString()
    bmc: string;

    @IsString()
    memoire: string;

    @IsString()
    label: string;
}
