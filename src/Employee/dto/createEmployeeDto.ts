export class CreateEmployeeDto{
    firstName:string;

    lastName:string;

    email:string;

    dateOfBirth:Date;

    constructor(firstName: string, lastName: string, email: string, dateOfBirth: Date) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.dateOfBirth = dateOfBirth;
    }

}