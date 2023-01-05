import {CreateEmployeeDto} from "../../Employee/dto/createEmployeeDto.js";
import {faker} from "@faker-js/faker";

export function mockCreateEmployeeDto(
    options: Partial<CreateEmployeeDto> = {},
): CreateEmployeeDto {
    return new CreateEmployeeDto(
        options.firstName ?? faker.name.firstName(),
        options.lastName ?? faker.name.lastName(),
        options.email ?? faker.internet.email(),
        options.role ?? faker.name.jobTitle(),
        options.boss ?? undefined,
        options.dateOfBirth ?? faker.date.birthdate()
    )}