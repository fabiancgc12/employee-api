// @ts-ignore
export class BaseException extends Error {

    constructor(public status:number,public message:string | string[]) {
        // @ts-ignore
        super(message);
    }
}