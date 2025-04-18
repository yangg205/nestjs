import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class newCategoryDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;
}