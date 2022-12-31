import {NextFunction,Request,Response} from "express";
import {BaseError} from "../errors/BaseError.js";
import {ApiError} from "../errors/ApiError.js";

export function errorMiddleware(error:BaseError, req: Request, res: Response, next: NextFunction){
   //checking if the error comes in the api side
    if (error instanceof ApiError){
       const errorResp = {
           status: error.status ?? 500,
           message: error.message ?? "Something happened on the server"
       }
       res.status(errorResp.status).send(errorResp)
   } else {
       res.status(500)
       res.render('error', { error })
   }

}