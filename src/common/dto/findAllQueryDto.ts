import {IsEnum, IsNumber, Max, Min} from "class-validator";
import {Type} from "class-transformer";
import {DatabaseOrder} from "../database/DatabaseOrder.js";

export class FindAllQueryDto {
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    page:number = 1

    @IsNumber()
    @Min(1)
    @Max(25)
    @Type(() => Number)
    limit:number = 10

    @IsEnum(DatabaseOrder)
    order:DatabaseOrder = DatabaseOrder.DESC
}