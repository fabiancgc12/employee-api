import { Type } from "class-transformer";
import {IsEnum, IsNumber, Max, Min} from "class-validator";
import {DatabaseOrder} from "../../common/database/DatabaseOrder.js";

export class FindAllEmployeesQueryDto {
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