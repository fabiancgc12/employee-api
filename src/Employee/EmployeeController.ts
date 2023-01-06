import {RequestHandler, Router} from 'express';
import {BaseController} from "../common/controller/BaseController.js";
import {EmployeeService} from "./EmployeeService.js";
import {useValidationMiddleware} from "../common/middlewares/validationMiddleware.js";
import {CreateEmployeeDto} from "./dto/createEmployeeDto.js";
import {EmployeeModel} from "./model/EmployeeModel.js";

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
    this.router.get(`${this.baseRoute}/:id`,this.findOneById)
    this.router.post(this.baseRoute,useValidationMiddleware(CreateEmployeeDto),this.create)
  }

  findOneById:RequestHandler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const employee:EmployeeModel = await this.employeeService.findOneById(id)
      res.status(200).json(employee);
    } catch (e){
      next(e)
    }

  }

  create:RequestHandler = async (req,res,next) => {
    try {
      const dto = req.body
      const employee:EmployeeModel = await this.employeeService.createOne(dto);
      res.status(201).json(employee);
    }catch (e) {
      next(e)
    }
  }
}