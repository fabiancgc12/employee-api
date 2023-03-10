import {RequestHandler, Router} from 'express';
import {BaseController} from "../common/controller/BaseController.js";

export class HomeController extends BaseController{
  readonly router: Router;
  readonly baseRoute = "/";

  constructor() {
    super()
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get(this.baseRoute,this.get)
  }

  get:RequestHandler = (req,res,next) => {
    res.render('index', { title: 'Express' });
  }
}
