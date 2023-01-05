import {EmployeeService} from "./EmployeeService.js";
import {pgClient} from "../common/database/pgClient.js";
import {UniqueConstraintException} from "../common/exceptions/UniqueConstraintException.js";
import {ResourceNotFoundException} from "../common/exceptions/ResourceNotFoundException.js";
import {DatabaseOrder} from "../common/database/DatabaseOrder.js";
import {UpdateEmployeeDto} from "./dto/updateEmployeeDto.js";
import {mockCreateEmployeeDto} from "../common/utils/mockCreateEmployeeDto.js";

describe("Employee Service",() => {
    let service:EmployeeService;
    beforeAll(async () => {
    })
    beforeEach(() => {
        service = new EmployeeService();
    })

    afterAll(async () => {
        await pgClient.end()
    })

    it('should create one employee without boss', async function () {
        const dto = mockCreateEmployeeDto()
        expect(await service.createOne(dto)).toMatchObject({
            id:expect.any(String),
            firstName:dto.firstName,
            lastName:dto.lastName,
            email:dto.email,
            boss:undefined,
            dateOfBirth:dto.dateOfBirth,
            createdAt:expect.any(Date),
            updatedAt:expect.any(Date)
        })
    });

    it('should create one employee with a boss', async function () {
        let dto = mockCreateEmployeeDto();
        const boss = await service.createOne(dto)
        dto = mockCreateEmployeeDto({
            boss:boss.id
        });
        expect(await service.createOne(dto)).toMatchObject({
            id:expect.any(String),
            firstName:dto.firstName,
            lastName:dto.lastName,
            email:dto.email,
            boss:dto.boss,
            dateOfBirth:dto.dateOfBirth,
            createdAt:expect.any(Date),
            updatedAt:expect.any(Date)
        })
    });

    it('should throw error when creating employee with repeated email', async function () {
        const firstEmployeeDto = mockCreateEmployeeDto();
        await service.createOne(firstEmployeeDto)
        const secondEmployeeDto = mockCreateEmployeeDto({
            email:firstEmployeeDto.email
        });
        await expect(service.createOne(secondEmployeeDto)).rejects.toThrow(UniqueConstraintException)
    });

    it('should get one employee', async function () {
        const dto = mockCreateEmployeeDto();
        const employee = await service.createOne(dto)
        await expect(service.findOneById(employee.id)).resolves.toEqual(employee)
    });

    it('should throw error when employee id does not exist', async function () {
        await expect(service.findOneById('1000000000')).rejects.toThrow(ResourceNotFoundException)
    });

    it('should find all employees', async function () {
        const limit = 10;
        const page = 1;
        const employees = await service.findAll(limit,page)
        expect(employees.length).toBeLessThanOrEqual(10)
    });

    it('should find 0 employees', async function () {
        const limit = 10;
        const page = 10000000;
        const employees = await service.findAll(limit,page)
        expect(employees).toHaveLength(0)
    });

    it('should find 10 employees in desc order', async function () {
        const limit = 10;
        const page = 1;
        const employeesDesc = await service.findAll(limit,page,DatabaseOrder.DESC)
        expect(employeesDesc.length).toBeLessThanOrEqual(10)
    });

    it('should update one employee firstname', async function () {
        const createDto = mockCreateEmployeeDto();
        const employee = await service.createOne(createDto);
        const updateDto:UpdateEmployeeDto = {
            firstName: "dave"
        }
        //we are ignoring the updateat property because it will always be diferent
        const {updatedAt,...rest} = employee
        const patchedEmployee = {...rest,...updateDto}
        await expect(service.updateOne(employee.id,updateDto)).resolves.toMatchObject(patchedEmployee)
        await expect(service.findOneById(employee.id)).resolves.toMatchObject(patchedEmployee)
    });

    it('should update one employee whole data', async function () {
        const createDto = mockCreateEmployeeDto();
        const employee = await service.createOne(createDto);
        const updateDto:UpdateEmployeeDto = mockCreateEmployeeDto()
        //we are ignoring the updateat property because it will always be different
        const {updatedAt,...rest} = employee
        const patchedEmployee = {...rest,...updateDto}
        await expect(service.updateOne(employee.id,updateDto)).resolves.toMatchObject(patchedEmployee)
        await expect(service.findOneById(employee.id)).resolves.toMatchObject(patchedEmployee)
    });

    it('should update one employee boss', async function () {
        const createDto = mockCreateEmployeeDto();
        const boss = await service.createOne(mockCreateEmployeeDto());
        let employee = await service.createOne(createDto);
        expect(employee.boss).toBe(undefined)
        let updateDto:UpdateEmployeeDto = {
            boss:boss.id
        }
        employee = await service.updateOne(employee.id,updateDto)
        expect(employee.boss).toBe(boss.id)
        const newBoss = await service.createOne(mockCreateEmployeeDto())
        updateDto = {
            boss:newBoss.id
        }
        employee = await service.updateOne(employee.id,updateDto)
        expect(employee.boss).toBe(newBoss.id)
    });

    it('should throw error if trying to update with existing email',async function () {
        const oldEmployee = await service.createOne(mockCreateEmployeeDto());
        const employee = await service.createOne(mockCreateEmployeeDto());
        const updateDto:UpdateEmployeeDto = {
            email:oldEmployee.email
        };
        await expect(service.updateOne(employee.id,updateDto)).rejects.toThrow(UniqueConstraintException)
    });

    it('should should throw error on update if employee does not exist', async function () {
        const updateDto:UpdateEmployeeDto = mockCreateEmployeeDto()
        await expect(service.updateOne("100000000",updateDto)).rejects.toThrow(ResourceNotFoundException)
    });

    it('should delete one employee',async function () {
        const dto = mockCreateEmployeeDto();
        const employee = await service.createOne(dto)
        await expect(service.deleteOneById(employee.id)).resolves.toEqual(true)
        await expect(service.findOneById(employee.id)).rejects.toThrow(ResourceNotFoundException)
    });

    it('should throw error on delete if id does not exist', async function () {
        await expect(service.deleteOneById('1000000000')).rejects.toThrow(ResourceNotFoundException)
    });
})