import { IsDefined, IsString } from 'class-validator';

export class CreateDefenseAuthorizationDto {
    @IsString()
    @IsDefined()
    uploadedFile: string;
}
