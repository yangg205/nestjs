import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class deleteCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}