export class EmployeeModel {
    id:string;
    firstName:string;
    lastName:string;
    email:string;
    dateOfBirth:Date;
    createdAt:Date;
    updatedAt:Date;

    constructor(id: string, firstName: string, lastName: string, email: string, dateOfBirth: Date, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}