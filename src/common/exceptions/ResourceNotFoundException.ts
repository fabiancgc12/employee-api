import {ApiException} from "./ApiException.js";

export class ResourceNotFoundException extends ApiException{
    constructor(resource:string,id:string | undefined) {
        let message = "Resource identification cant be undefined"
        if (typeof id == "string")
            message = `The resource ${resource} with id ${id} does not exist`
        super(404,message)
    }
}