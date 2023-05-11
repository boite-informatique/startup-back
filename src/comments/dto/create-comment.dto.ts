import { IsInt, IsString } from 'class-validator';
export class CreateCommentDto {
    @IsInt()
    taskId: number;
    @IsInt()
    authorId: number;

    @IsString()
    body: string;
}
