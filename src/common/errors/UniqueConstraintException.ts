import {ApiError} from "./ApiError.js";

export class UniqueConstraintException extends ApiError{
    constructor(key:string) {
        super(409,`The ${key} is already on use`);
    }

}