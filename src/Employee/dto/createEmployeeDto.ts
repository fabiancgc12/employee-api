export class CreateEmployeeDto{
    firstName:string;

    lastName:string;

    email:string;

    role:string

    dateOfBirth:Date;

    constructor(firstName: string, lastName: string, email: string,role:string, dateOfBirth: Date) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role
        this.dateOfBirth = dateOfBirth;
    }

}