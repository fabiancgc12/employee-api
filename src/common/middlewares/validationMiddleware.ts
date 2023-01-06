import {Request, RequestHandler, Response} from "express";
import {validate } from "class-validator";
import {plainToInstance} from "class-transformer";
import {ValidationException} from "../exceptions/ValidationException.js";

export function useValidationMiddleware(dtoClass:any):RequestHandler {
    return async (req: Request, res: Response,next) => {
        try {
            const instance = plainToInstance(dtoClass,req.body)
            const errors = await validate(instance)
            if (errors.length > 0){
                next(new ValidationException(errors))
            }
            next()
        } catch (e){
            next(e)
        }
    }
}