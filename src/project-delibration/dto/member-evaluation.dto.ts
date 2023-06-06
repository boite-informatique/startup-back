import { IsInt, IsString } from 'class-validator';

export class MemberEvaluationDto {
    @IsInt()
    member_id: number;
    @IsInt()
    note: number;
    @IsString()
    appreciation: string;
}
