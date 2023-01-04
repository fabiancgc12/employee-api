import {ApiException} from "./ApiException.js";

export class ResourceNotFoundException extends ApiException{
    constructor(resource:string,id:string) {
        super(404,`The resource ${resource} with id ${id} does not exist`)
    }
}