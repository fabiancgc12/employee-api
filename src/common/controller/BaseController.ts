import {Router} from "express";

export abstract class BaseController{

 abstract baseRoute:string
 abstract router: Router;
 protected constructor() {}
}