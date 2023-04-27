import { IsNotEmpty, IsString, IsEmail, IsEnum, isNotEmpty, isString, IsIn, IsInt } from 'class-validator';

export class CreateProjectDto {

  @IsIn(["patent", "startup"])
  type: "patent" | "startup"

  @IsNotEmpty()
  @IsString()
  resume: string;

  @IsNotEmpty()
  @IsString()
  brand_name: string;

  @IsNotEmpty()
  @IsString()
  product_name: string;

  @IsInt()
  owner_id : number;

  @IsInt()
  supervisor_id : number;

  @IsInt()
  co_supervisor_id : number;

  @IsInt({each : true})
  membersId : number[] 

  


}
