import {NextFunction,Request,Response} from "express";
import {BaseException} from "../exceptions/BaseException.js";
import {ApiException} from "../exceptions/ApiException.js";

export function errorMiddleware(error:BaseException, req: Request, res: Response, next: NextFunction){
   //checking if the error comes in the api side
    if (error instanceof ApiException){
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