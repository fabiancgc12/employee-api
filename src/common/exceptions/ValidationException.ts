import {ApiException} from "./ApiException.js";
import {ValidationError} from "class-validator";

export class ValidationException extends ApiException{
    constructor(errors:ValidationError[]) {
        const message = errors.map(error => {
            if (error.constraints)
                return Object.values(error.constraints).join(",")
            else
                return ""
        })
        super(400,message);
    }
}