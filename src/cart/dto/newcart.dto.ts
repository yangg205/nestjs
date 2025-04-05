import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { CartProductDto } from "./cartproduct.dto"; // Nếu bạn đang sử dụng DTO riêng cho sản phẩm
import { Type } from "class-transformer";

export class NewCartDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        type: [CartProductDto], 
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CartProductDto) 
    products: CartProductDto[]; 

    @ApiProperty()
    @IsNumber()
    totalPrice: number; 
}
