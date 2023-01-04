import {ApiError} from "./ApiError.js";

export class ServerException extends ApiError{
    constructor() {
        super(500,"Something happened on the server");
    }
}