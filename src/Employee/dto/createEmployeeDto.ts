import {IsDateString, IsEmail, IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength} from "class-validator";

export class CreateEmployeeDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    firstName:string;


    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    lastName:string;


    @IsNotEmpty()
    @IsEmail()
    email:string;


    @IsNotEmpty()
    @IsString()
    role:string;

    @IsNumberString()
    @IsOptional()
    boss?:string;


    @IsNotEmpty()
    @IsDateString()
    dateOfBirth:Date;

    constructor(firstName: string, lastName: string, email: string,role:string, boss:string|undefined,dateOfBirth: Date) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role
        this.boss = boss
        this.dateOfBirth = dateOfBirth;
    }

}