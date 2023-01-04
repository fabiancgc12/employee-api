import {ApiException} from "./ApiException.js";

export class ServerException extends ApiException{
    constructor() {
        super(500,"Something happened on the server");
    }
}