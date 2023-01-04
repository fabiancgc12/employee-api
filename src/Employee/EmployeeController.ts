import {RequestHandler, Router} from 'express';
import {BaseController} from "../common/controller/BaseController.js";

export class EmployeeController extends BaseController{
  readonly baseRoute = "/users";
  readonly router: Router;

  constructor() {
    super()
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get(this.baseRoute,this.get)
    this.router.post(this.baseRoute,this.create)
  }

  get:RequestHandler = async (req,res,next) => {
    res.send('respond with a resource');
  }

  create:RequestHandler = async (req,res) => {
    console.log(req.body)
    res.send('holis');
  }
}