import {EmployeeService} from "./EmployeeService.js";
import {CreateEmployeeDto} from "./dto/createEmployeeDto.js";
import {pgClient} from "../common/database/pgClient.js";
import {faker} from "@faker-js/faker";
import {UniqueConstraintException} from "../common/exceptions/UniqueConstraintException.js";


function mockCreateEmployeeDto(
    options: Partial<CreateEmployeeDto> = {},
): CreateEmployeeDto {
    return new CreateEmployeeDto(
        options.firstName ?? faker.name.firstName(),
        options.lastName ?? faker.name.lastName(),
            options.email ?? faker.internet.email(),
        options.dateOfBirth ?? faker.date.birthdate()
)}

describe("Employee controller",() => {
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
            id:expect.any(Number),
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

})