export class EmployeeModel {
    id:number;
    firstName:string;
    lastName:string;
    email:string;
    dateOfBirth:string;
    createdAt:string;
    updatedAt:string;

    constructor(id: number, firstName: string, lastName: string, email: string, dateOfBirth: string, createdAt: string, updatedAt: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}