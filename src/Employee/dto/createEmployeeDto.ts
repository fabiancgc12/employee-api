export class CreateEmployeeDto{
    firstName:string;

    lastName:string;

    email:string;

    role:string;
    boss?:string;

    dateOfBirth:Date;

    constructor(firstName: string, lastName: string, email: string,role:string, boss:string|undefined,dateOfBirth: Date) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role
        this.boss = boss
        this.dateOfBirth = dateOfBirth;
    }

}