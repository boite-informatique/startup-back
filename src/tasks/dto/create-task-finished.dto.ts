import { IsInt, IsString } from "class-validator"

export class CreateTaskFinishedDto {
    @IsInt()
    taskId: number;
    @IsString()
    description:  string
    @IsString({ each: true })
    resources:  string[]
}