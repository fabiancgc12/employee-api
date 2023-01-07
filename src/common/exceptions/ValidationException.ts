import {ApiException} from "./ApiException.js";
import {ValidationError} from "class-validator";

export class ValidationException extends ApiException{
    constructor(errors:ValidationError[]) {
        const message:string[] = [];
        errors.forEach(error => {
            if (error.constraints)
                message.push(...Object.values(error.constraints))
        })
        super(400,message);
    }
}