import {CreateEmployeeDto} from "./dto/createEmployeeDto.js";
import {EmployeeModel} from "./model/EmployeeModel.js";
import {pgClient} from "../common/database/pgClient.js";
import {PostgresErrorCodes} from "../common/database/PostgresErrorCodes.js";
import {UniqueConstraintException} from "../common/exceptions/UniqueConstraintException.js";
import {ServerException} from "../common/exceptions/ServerException.js";
import {DatabaseError} from "pg";

export class EmployeeService {
    async createOne(employeeDto:CreateEmployeeDto):Promise<EmployeeModel> {
        try {
            const values = [employeeDto.firstName,employeeDto.lastName,employeeDto.email,employeeDto.dateOfBirth,new Date()]
            const result = await pgClient.query(
                'INSERT INTO "Employee" ("firstName","lastName","email","dateOfBirth","updatedAt") VALUES ($1,$2,$3,$4,$5) RETURNING *',
                values)
            const data = result.rows[0]
            return new EmployeeModel(
                data.id,
                data.firstName,
                data.lastName,
                data.email,
                data.dateOfBirth,
                data.createdAt,
                data.updatedAt
            )
        }
        catch (e) {
            if (e instanceof DatabaseError && e.code == PostgresErrorCodes.DuplicatePrimaryKey){
                throw new UniqueConstraintException("email")
            }
            throw new ServerException()
        }
    }
}