import { ApiProperty } from "@nestjs/swagger";
import { IS_OBJECT, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class newProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    type: ObjectId;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;

}