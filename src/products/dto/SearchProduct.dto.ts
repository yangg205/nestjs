// src/products/dto/searchProduct.dto.ts
import { IsOptional, IsString, IsNumber, min, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchProductDto {
  @ApiProperty({ required: false, description: 'Tên sản phẩm' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, type: Number, description: 'Giá bắt đầu' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  startPrice?: number;

  @ApiProperty({ required: false, type: Number, description: 'Giá kết thúc' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  endPrice?: number;

  @ApiProperty({ required: false, enum: ['asc', 'desc'], description: 'Sắp xếp theo giá (asc/desc)' })
  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc';

  @ApiProperty({ required: false, type: Number, description: 'Số trang (mặc định: 1)' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false, type: Number, description: 'Số sản phẩm mỗi trang (mặc định: 10)' })
  @IsOptional()
  @IsNumber()
  @Min(1)//số sản phẩm phải lớn hơn hoặc bằng 1
  limit?: number;
}