import {CreateEmployeeDto} from "./dto/createEmployeeDto.js";
import {EmployeeModel} from "./model/EmployeeModel.js";
import {pgClient} from "../common/database/pgClient.js";
import {PostgresErrorCodes} from "../common/database/PostgresErrorCodes.js";
import {UniqueConstraintException} from "../common/exceptions/UniqueConstraintException.js";
import {DatabaseError} from "pg";
import {ResourceNotFoundException} from "../common/exceptions/ResourceNotFoundException.js";
import {ServerException} from "../common/exceptions/ServerException.js";
import {DatabaseOrder} from "../common/database/DatabaseOrder.js";

export class EmployeeService {
    async createOne(employeeDto:CreateEmployeeDto):Promise<EmployeeModel> {
        try {
            const values = [employeeDto.firstName,employeeDto.lastName,employeeDto.email,employeeDto.dateOfBirth,new Date()]
            const result = await pgClient.query(
                'INSERT INTO "Employee" ("firstName","lastName","email","dateOfBirth","updatedAt") VALUES ($1,$2,$3,$4,$5) RETURNING *',
                values)
            const data = result.rows[0]
            return this.dataToEmployeeModel(data)
        }
        catch (e) {
            if (e instanceof DatabaseError && e.code == PostgresErrorCodes.DuplicatePrimaryKey){
                throw new UniqueConstraintException("email")
            }
            throw e
        }
    }

    async findOneById(id:string):Promise<EmployeeModel> {
        try {
            const result = await pgClient.query(
                'SELECT * FROM "Employee" WHERE id = $1',
                [id]
            );
            if (result.rowCount == 0)
                throw new ResourceNotFoundException("employee",id)
            const data = result.rows[0]
            return this.dataToEmployeeModel(data)
        }
        catch (e) {
            if (e instanceof ResourceNotFoundException)
                throw e
            throw new ServerException()
        }
    }

    async findAll(limit:number,page:number,order = DatabaseOrder.ASC){
        try {
            let queryOrder = order == DatabaseOrder.DESC ? DatabaseOrder.DESC : ""
            const offset = (page - 1)*limit
            const result = await pgClient.query(
                `SELECT * FROM "Employee" ORDER BY id ${queryOrder} LIMIT $1 OFFSET $2`,
                [limit,offset])
            return result.rows;
        }catch (e) {
            throw new ServerException()
        }
    }

    async deleteOneById(id:string):Promise<boolean>{
        try {
            const result = await pgClient.query(
                'DELETE FROM "Employee" WHERE id = $1',
                [id]
            );
            if (result.rowCount == 0)
                throw new ResourceNotFoundException("employee",id)
            return true
        } catch (e) {
            if (e instanceof ResourceNotFoundException)
                throw e
            throw new ServerException()
        }
    }

    private dataToEmployeeModel(data:any):EmployeeModel{
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
}