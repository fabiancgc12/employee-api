import {CreateEmployeeDto} from "./createEmployeeDto.js";

export class UpdateEmployeeDto {
    firstName?:string;

    lastName?:string;

    email?:string;

    dateOfBirth?:Date;
}