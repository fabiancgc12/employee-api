import {IsNotEmpty, IsNumberString} from "class-validator";

export class EmployeeParamsDto {
    @IsNumberString()
    @IsNotEmpty()
    id:string

    constructor(id: string) {
        this.id = id;
    }
}