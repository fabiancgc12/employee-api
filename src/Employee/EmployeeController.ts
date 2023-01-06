import {RequestHandler, Router} from 'express';
import {BaseController} from "../common/controller/BaseController.js";
import {EmployeeService} from "./EmployeeService.js";

export class EmployeeController extends BaseController{
  readonly baseRoute = "/users";
  readonly router: Router;

  private employeeService:EmployeeService

  constructor() {
    super()
    this.router = Router();
    this.employeeService = new EmployeeService()
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get(this.baseRoute,this.get)
    this.router.post(this.baseRoute,this.create)
  }

  get:RequestHandler = async (req,res,next) => {
    res.send('respond with a resource');
  }

  create:RequestHandler = async (req,res,next) => {
    try {
      const dto = req.body
      const employee = await this.employeeService.createOne(dto);
      res.status(201).json(employee);
    }catch (e) {
      next(e)
    }
  }
}