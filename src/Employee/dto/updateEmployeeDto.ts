import {IsDateString, IsNumberString, IsOptional, IsString, MinLength} from "class-validator";

export class UpdateEmployeeDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    firstName?:string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    lastName?:string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    email?:string;

    @IsString()
    @IsOptional()
    role?:string;

    @IsNumberString()
    @IsOptional()
    boss?:string;

    @IsDateString()
    @IsOptional()
    dateOfBirth?:Date;
}