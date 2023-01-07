import request from "supertest";
import app from "../app.js";
import {mockCreateEmployeeDto} from "../common/utils/mockCreateEmployeeDto.js";
import {pgClient} from "../common/database/pgClient.js";
import {DatabaseOrder} from "../common/database/DatabaseOrder.js";

describe("Employee controller",() => {

    afterAll(async () => {
        await pgClient.end()
    })

    describe("GET USERS/{id},", () => {
        it('should get one employee', async function () {
            const dto = mockCreateEmployeeDto();
            const {body:employee} = await request(app).post("/users").send(dto);
            return request(app)
                .get(`/users/${employee.id}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(employee)
        });

        it('should throw error when employee id does not exist', async function () {
            return request(app)
                .get(`/users/100000000`)
                .expect(404)
        });

        it('should throw error when param id is not number', async function () {
            await request(app)
                .get(`/users/thisisnotandid`)
                .expect(400)
            await request(app)
                .get(`/users/0`)
                .expect(404)
            await request(app)
                .get(`/users/-1`)
                .expect(404)
        });

    })

    describe('GET ALL USERS', () => {
        it('should find all employees', async function () {
            const limit = 10;
            const page = 1;
            return request(app)
                .get(`/users/?page=${page}&limit=${limit}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(res => {
                    expect(res.body.length).toBeLessThanOrEqual(10)
                })
        });

        it('should find 0 employees', async function () {
            const limit = 10;
            const page = 10000000;
            return request(app)
                .get(`/users/?page=${page}&limit=${limit}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(res => {
                    expect(res.body.length).toBeLessThanOrEqual(0)
                })
        });

        it('should find 15 employees in desc order', async function () {
            const limit = 15;
            const page = 1;
            const order = DatabaseOrder.ASC
            return request(app)
                .get(`/users/?page=${page}&limit=${limit}&order=${order}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(res => {
                    expect(res.body.length).toBeLessThanOrEqual(15)
                })
        });

        it('should find 10 employees if no query is sent', async function () {
            return request(app)
                .get(`/users/?`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(res => {
                    expect(res.body.length).toBeLessThanOrEqual(10)
                })
        });

        it('should find 10 employees if only page is sent', async function () {
            const page = 3;
            return request(app)
                .get(`/users/?page=${page}`)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(res => {
                    expect(res.body.length).toBeLessThanOrEqual(10)
                })
        });

        it('should throw error if query is invalid', async function () {
            const page = "thispageiswrong"
            const limit = "thislimitisivalid"
            const order = "notDescNorAsc"
            return request(app)
                .get(`/users/?page=${page}&limit=${limit}&order=${order}`)
                .expect(400)
                .expect('Content-Type', /json/)
                .expect(res => {
                    expect(res.body.message).toBeInstanceOf(Array)
                    expect(res.body.message).toContain("page must not be less than 1")
                    expect(res.body.message).toContain("page must be a number conforming to the specified constraints")
                    expect(res.body.message).toContain("limit must not be greater than 25")
                    expect(res.body.message).toContain("limit must not be less than 1")
                    expect(res.body.message).toContain("order must be one of the following values: ASC, DESC")
                })
        });

        it('should throw error if page or limit are negatives', async function () {
            const page = -1
            const limit = -1
            return request(app)
                .get(`/users/?page=${page}&limit=${limit}`)
                .expect(400)
                .expect('Content-Type', /json/)
                .expect(res => {
                    expect(res.body.message).toBeInstanceOf(Array)
                    expect(res.body.message).toContain("page must not be less than 1")
                    expect(res.body.message).toContain("limit must not be less than 1")
                })
        });

        it('should throw error if limit is over 25', async function () {
            const limit = 30
            return request(app)
                .get(`/users/?limit=${limit}`)
                .expect(400)
                .expect('Content-Type', /json/)
                .expect(res => {
                    expect(res.body.message).toBeInstanceOf(Array)
                    expect(res.body.message).toContain("limit must not be greater than 25")
                })
        });

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

        it('should throw error when dto if not sent', function () {
            return request(app)
                .post("/users")
                .expect(400)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body.message).toBeInstanceOf(Array)
                    expect(res.body.message.some(val => /firstName/.test(val))).toBe(true)
                    expect(res.body.message.some(val => /lastName/.test(val))).toBe(true)
                    expect(res.body.message.some(val => /email/.test(val))).toBe(true)
                    expect(res.body.message.some(val => /role/.test(val))).toBe(true)
                    expect(res.body.message.some(val => /dateOfBirth/.test(val))).toBe(true)
                    // expect(res.body.message).toContain(["firstName must not be less than 3"])
                })
        });

        it('should throw error when dto has incorrect data', function () {
            const dto =mockCreateEmployeeDto ({
                firstName:"aa",
                email:"thisisnotanemail",
                lastName:"bb",
                // @ts-ignore
                role:5,
                // @ts-ignore
                boss:5,
                // @ts-ignore
                dateOfBirth:"thisisnotadate"
            })
            return request(app)
                .post("/users")
                .send(dto)
                .expect(400)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body.message).toBeInstanceOf(Array)
                    expect(res.body.message.some(val => /firstName/.test(val))).toBe(true)
                    expect(res.body.message.some(val => /lastName/.test(val))).toBe(true)
                    expect(res.body.message.some(val => /email/.test(val))).toBe(true)
                    expect(res.body.message.some(val => /role/.test(val))).toBe(true)
                    expect(res.body.message.some(val => /dateOfBirth/.test(val))).toBe(true)
                    // expect(res.body.message).toContain(["firstName must not be less than 3"])
                })
        });
    });

})