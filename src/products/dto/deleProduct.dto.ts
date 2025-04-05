import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class deleteProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}