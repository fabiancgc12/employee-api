import {EmployeeController} from "./EmployeeController.js";
import request from "supertest";
import app from "../app.js";

describe("Employee controller",() => {
    let controller:EmployeeController
    beforeEach(() => {
        controller = new EmployeeController();
    })

    it('should create one employee', function () {

    });
})