import {RequestHandler, Router} from 'express';
import {BaseController} from "../common/controller/BaseController.js";
import {EmployeeService} from "./EmployeeService.js";
import {useValidationMiddleware} from "../common/middlewares/validationMiddleware.js";
import {CreateEmployeeDto} from "./dto/createEmployeeDto.js";
import {EmployeeModel} from "./model/EmployeeModel.js";
import {ServerException} from "../common/exceptions/ServerException.js";
import {UniqueConstraintException} from "../common/exceptions/UniqueConstraintException.js";
import {ResourceNotFoundException} from "../common/exceptions/ResourceNotFoundException.js";
import {EmployeeParamsDto} from "./dto/EmployeeParamsDto.js";
import {plainToInstance} from "class-transformer";
import {UpdateEmployeeDto} from "./dto/updateEmployeeDto.js";
import {FindAllDto} from "../common/dto/findAllDto.js";
import {FindAllQueryDto} from "../common/dto/findAllQueryDto.js";

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
    this.router.get(`${this.baseRoute}/:id`,useValidationMiddleware(EmployeeParamsDto,"params"),this.findOneById)
    this.router.get(this.baseRoute,useValidationMiddleware(FindAllQueryDto,"query"),this.findAll)
    this.router.post(this.baseRoute,useValidationMiddleware(CreateEmployeeDto),this.create)
    this.router.patch(
        `${this.baseRoute}/:id`,
        useValidationMiddleware(EmployeeParamsDto,"params"),
        useValidationMiddleware(UpdateEmployeeDto,"body"),
        this.updateOneById
    )
    this.router.delete(`${this.baseRoute}/:id`,useValidationMiddleware(EmployeeParamsDto,"params"),this.delete)
  }

  findOneById:RequestHandler = async (req, res, next) => {
    try {
      const id = req.params.id;
      const employee:EmployeeModel = await this.employeeService.findOneById(id)
      res.status(200).json(employee);
    } catch (e){
      if (e instanceof ResourceNotFoundException)
        next(e)
      else
        next (new ServerException())
    }
  }

  findAll:RequestHandler = async (req,res,next) => {
    try {
      const query = plainToInstance(FindAllQueryDto,req.query);
      const employees:EmployeeModel[] = await this.employeeService.findAll(query.limit,query.page,query.order)
      const resp = new FindAllDto(employees,query)
      res.status(200).json(resp)
    } catch (e) {
      next(new ServerException())
    }

  }
  create:RequestHandler = async (req,res,next) => {
    try {
      const dto = req.body
      const employee:EmployeeModel = await this.employeeService.createOne(dto);
      res.status(201).json(employee);
    }catch (e) {
      if (e instanceof UniqueConstraintException || e instanceof ResourceNotFoundException)
        next(e)
      else
        next (new ServerException())
    }
  }

  updateOneById:RequestHandler = async (req,res,next) => {
    try{
      const dto = req.body
      const id = req.params.id
      const employee:EmployeeModel = await this.employeeService.updateOne(id,dto);
      res.status(200).json(employee)
    }catch (e) {
      if  (e instanceof UniqueConstraintException || e instanceof ResourceNotFoundException)
        next(e)
      next(new ServerException())
    }

  }

  delete:RequestHandler = async (req,res,next) => {
    try {
      const id = req.params.id;
      await this.employeeService.deleteOneById(id)
      res.status(200).send()
    } catch (e) {
      if (e instanceof ResourceNotFoundException)
        next(e)
      else
        next(new ServerException())
    }
  }
}