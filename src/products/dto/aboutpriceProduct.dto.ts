import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AboutPriceProductDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    pricestart: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    priceend: number;
}