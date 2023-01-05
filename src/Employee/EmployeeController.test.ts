import {EmployeeController} from "./EmployeeController.js";
import request from "supertest";
import app from "../app.js";
import {mockCreateEmployeeDto} from "../common/utils/mockCreateEmployeeDto.js";
describe("Employee controller",() => {

    it('should create one employee without boss', async function () {
        const dto = mockCreateEmployeeDto()
        return request(app)
            .post("users")
            .send(dto)
            .expect(201)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res).toMatchObject({
                    id:expect.any(String),
                    firstName:dto.firstName,
                    lastName:dto.lastName,
                    email:dto.email,
                    boss:undefined,
                    dateOfBirth:dto.dateOfBirth,
                    createdAt:expect.any(Date),
                    updatedAt:expect.any(Date)
                })
            })
    });
})