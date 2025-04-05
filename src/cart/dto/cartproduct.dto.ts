import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { ObjectId, Types } from "mongoose";

export class CartProductDto {
    @ApiProperty()
    @IsNotEmpty()
    productId: Types.ObjectId;

    @ApiProperty()
    @IsNumber()
    quantity: number;
}