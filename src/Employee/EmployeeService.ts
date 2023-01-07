import {CreateEmployeeDto} from "./dto/createEmployeeDto.js";
import {EmployeeModel} from "./model/EmployeeModel.js";
import {pgClient} from "../common/database/pgClient.js";
import {PostgresErrorCodes} from "../common/database/PostgresErrorCodes.js";
import {UniqueConstraintException} from "../common/exceptions/UniqueConstraintException.js";
import pg from "pg";
import {ResourceNotFoundException} from "../common/exceptions/ResourceNotFoundException.js";
import {ServerException} from "../common/exceptions/ServerException.js";
import {DatabaseOrder} from "../common/database/DatabaseOrder.js";
import {UpdateEmployeeDto} from "./dto/updateEmployeeDto.js";

export class EmployeeService {
    createOne = async (employeeDto:CreateEmployeeDto):Promise<EmployeeModel> => {
        try {
            const values = [employeeDto.firstName,employeeDto.lastName,employeeDto.email,employeeDto.role,employeeDto.boss,employeeDto.dateOfBirth,new Date()]
            const result = await pgClient.query(
                'INSERT INTO "Employee" ("firstName","lastName","email","role","boss","dateOfBirth","updatedAt") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
                values)
            const data = result.rows[0]
            return this.dataToEmployeeModel(data)
        }
        catch (e) {
            if (e instanceof pg.DatabaseError){
                if (e.code == PostgresErrorCodes.DuplicatePrimaryKey)
                    throw new UniqueConstraintException("email")
                if (e.code == PostgresErrorCodes.ForeignKeyViolation)
                    throw new ResourceNotFoundException("employee",employeeDto.boss)
                else
                    throw e
            }
            throw e
        }
    }

    findOneById = async (id:string):Promise<EmployeeModel> => {
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
            if (e instanceof ResourceNotFoundException || e instanceof pg.DatabaseError)
                throw e
            throw new ServerException()
        }
    }

    findAll = async (limit:number,page:number,order = DatabaseOrder.ASC) => {
        try {
            let queryOrder = order == DatabaseOrder.DESC ? DatabaseOrder.DESC : ""
            const offset = (page - 1)*limit
            const result = await pgClient.query(
                `SELECT * FROM "Employee" ORDER BY id ${queryOrder} LIMIT $1 OFFSET $2`,
                [limit,offset])
            return this.dataArrayToEmployeeArray(result.rows)
        }catch (e) {
            throw new ServerException()
        }
    }

    updateOne = async (id:string,dto:UpdateEmployeeDto):Promise<EmployeeModel> => {
        try {
            const employee = await this.findOneById(id);
            //if dto is empty then just return the employee and not make any update
            if (Object.keys(dto).length === 0)
                return employee
            dto.firstName = dto.firstName ?? employee.firstName;
            dto.lastName = dto.lastName ?? employee.lastName;
            dto.email = dto.email ?? employee.email;
            dto.boss = dto.boss ?? employee.boss;
            dto.role = dto.role ?? employee.role;
            dto.dateOfBirth = dto.dateOfBirth ?? employee.dateOfBirth;
            const result = await pgClient.query(
                `UPDATE "Employee" SET "firstName" = $2, "lastName" = $3, 
                      "email" = $4, "dateOfBirth" = $5, "updatedAt" = $6, "role" = $7, "boss" = $8
                      WHERE id = $1
                      RETURNING *`,
                [id,dto.firstName,dto.lastName,dto.email,dto.dateOfBirth, new Date(),dto.role,dto.boss]
            )
            const data = result.rows[0]
            return this.dataToEmployeeModel(data);
        } catch (e) {
            if (e instanceof pg.DatabaseError){
                if (e.code == PostgresErrorCodes.DuplicatePrimaryKey)
                    throw new UniqueConstraintException("email")
                else
                    throw e
            }
            if (e instanceof ResourceNotFoundException)
                throw e
            throw new ServerException()
        }
    }

    deleteOneById = async (id:string):Promise<boolean> => {
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

    public dataToEmployeeModel = (data:any):EmployeeModel => {
        return new EmployeeModel(
            data.id,
            data.firstName,
            data.lastName,
            data.role,
            data.email,
            data.boss,
            new Date(data.dateOfBirth),
            new Date(data.createdAt),
            new Date(data.updatedAt)
        )
    }

    public dataArrayToEmployeeArray = (dataArray:any[]):EmployeeModel[] => {
        return dataArray.map(this.dataToEmployeeModel)
    }
}