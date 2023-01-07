import {EmployeeModel} from "../model/EmployeeModel.js";
import {FindAllEmployeesQueryDto} from "./findAllEmployeesQueryDto.js";

export class FindAllEmployeesDto{
    constructor(
        public data:EmployeeModel[],
        public meta:FindAllEmployeesQueryDto
    ) {}
}