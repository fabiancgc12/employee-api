import {EmployeeService} from "./EmployeeService.js";
import {CreateEmployeeDto} from "./dto/createEmployeeDto.js";
import {pgClient} from "../common/database/pgClient.js";
import {faker} from "@faker-js/faker";
import {UniqueConstraintException} from "../common/exceptions/UniqueConstraintException.js";
import {ResourceNotFoundException} from "../common/exceptions/ResourceNotFoundException.js";


function mockCreateEmployeeDto(
    options: Partial<CreateEmployeeDto> = {},
): CreateEmployeeDto {
    return new CreateEmployeeDto(
        options.firstName ?? faker.name.firstName(),
        options.lastName ?? faker.name.lastName(),
            options.email ?? faker.internet.email(),
        options.dateOfBirth ?? faker.date.birthdate()
)}

describe("Employee Service",() => {
    let service:EmployeeService;
    beforeAll(async () => {
        await pgClient.connect()
    })
    beforeEach(() => {
        service = new EmployeeService();
    })

    it('should create one employee', async function () {
        const dto = mockCreateEmployeeDto()
        expect(await service.createOne(dto)).toMatchObject({
            id:expect.any(String),
            firstName:dto.firstName,
            lastName:dto.lastName,
            email:dto.email,
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
        expect(employees).toHaveLength(10)
    });

    it('should find 0 employees', async function () {
        const limit = 10;
        const page = 10000000;
        const employees = await service.findAll(limit,page)
        expect(employees).toHaveLength(0)
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