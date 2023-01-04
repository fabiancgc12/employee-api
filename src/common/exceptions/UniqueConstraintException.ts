import {ApiException} from "./ApiException.js";

export class UniqueConstraintException extends ApiException{
    constructor(key:string) {
        super(409,`The ${key} is already on use`);
    }

}