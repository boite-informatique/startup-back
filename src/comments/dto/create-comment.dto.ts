import { IsInt, IsString } from 'class-validator';
export class CreateCommentDto {
    @IsString()
    body: string;
}
