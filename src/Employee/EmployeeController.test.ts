import request from "supertest";
import app from "../app.js";
import {mockCreateEmployeeDto} from "../common/utils/mockCreateEmployeeDto.js";
import {pgClient} from "../common/database/pgClient.js";

describe("Employee controller",() => {

    beforeAll(() => {

    })

    afterAll(async () => {
        await pgClient.end()
    })

    describe('POST/USERS', function () {

        it('should create one employee without boss', async function () {
            const dto = mockCreateEmployeeDto()
            return request(app)
                .post("/users")
                .send(dto)
                .expect(201)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).toMatchObject({
                        id:expect.any(String),
                        firstName:dto.firstName,
                        lastName:dto.lastName,
                        email:dto.email,
                        dateOfBirth:dto.dateOfBirth.toISOString(),
                        createdAt:expect.any(String),
                        updatedAt:expect.any(String)
                    })
                    expect(res.body).not.toHaveProperty("boss")
                })
        });

        it('should create one employee with a boss', async function () {
            let dto = mockCreateEmployeeDto();
            const {body: boss} = await request(app).post("/users").send(dto)
            dto = mockCreateEmployeeDto({
                boss:boss.id
            });
            return request(app)
                .post("/users")
                .send(dto)
                .expect(201)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).toMatchObject({
                        id:expect.any(String),
                        firstName:dto.firstName,
                        lastName:dto.lastName,
                        email:dto.email,
                        boss:dto.boss,
                        dateOfBirth:dto.dateOfBirth.toISOString(),
                        createdAt:expect.any(String),
                        updatedAt:expect.any(String)
                    })
                })
        });

        it('should throw error when creating employee with repeated email', async function () {
            const firstEmployeeDto = mockCreateEmployeeDto();
            await request(app).post("/users").send(firstEmployeeDto)
            const secondEmployeeDto = mockCreateEmployeeDto({
                email:firstEmployeeDto.email
            });
            return request(app)
                .post("/users")
                .send(secondEmployeeDto)
                .expect(409)
        });

    });


})