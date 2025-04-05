import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PriceProductDto {

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;
}