import {FindAllQueryDto} from "./findAllQueryDto.js";

export class FindAllDto<T>{
    constructor(
        public data:T[],
        public meta:FindAllQueryDto
    ) {}
}