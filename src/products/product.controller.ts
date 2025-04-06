import { All, Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./schema/product.schema";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { updatetypeDto } from "src/products/dto/updatetype.dto";
import { newProductDto } from "./dto/newProduct.dto";
import { deleteProductDto } from "./dto/deleProduct.dto";
import { PriceProductDto } from "./dto/priceProduct.dto";
import { AboutPriceProductDto } from "./dto/aboutpriceProduct.dto";
import { NameCategoryDto } from "./dto/nameCategory.dto";
import { query } from "express";

@Controller('products')
@ApiTags('Products')
export class ProductController {
    constructor(private readonly productservice: ProductService) { }
    @Get('/san-pham')
    @ApiQuery({ name: 'name', required: false })
    @ApiQuery({ name: 'price', required: false, type: Number })
    @ApiQuery({ name: 'HigherPrice', required: false, type: Number})
    @ApiQuery({ name: 'PriceLess', required: false, type: Number})
    @ApiQuery({ name: 'StartPrice', required: false, type: Number})
    @ApiQuery({ name: 'EndPrice', required: false, type: Number})
    @ApiQuery({ name: 'AllProduct', required: false, type: String})
    @ApiQuery({ name: 'Highest', required: false, type: String})
    @ApiQuery({ name: 'Lowest', required: false, type: String})
    async findProduct(
        @Query('name') name?: string,
        @Query('price') price?: number,
        @Query('HigherPrice') HigherPrice?: number,
        @Query('PriceLess') PriceLess?: number,
        @Query('StartPrice') StartPrice?: number,
        @Query('EndPrice') EndPrice?: number,
        @Query('AllProduct') AllProduct?: string,
        @Query('Highest') Highest?: string,
        @Query('Lowest') Lowest?: string
    ): Promise<Product[] | Product | { message: string }> {

        if (name) {
            return await this.productservice.FindByName(name);
        }

        if (price !== undefined) {
            return await this.productservice.FindByPrice(price);
        }

        if (HigherPrice !== undefined) {
            return await this.productservice.FindByHigherPrice(HigherPrice);
        }

        if (PriceLess !== undefined) {
            return await this.productservice.FindByPriceLess(PriceLess);
        }

        if (StartPrice !== undefined && EndPrice !== undefined) {
            return await this.productservice.FindByPriceAbout(StartPrice, EndPrice);
        }

        if (AllProduct === 'true') {
            return await this.productservice.FindAll();
        }

        if (Highest === 'true') {
            return await this.productservice.FindByHighestPrice();
        }

        if (Lowest === 'true') {
            return await this.productservice.FindByLowestPrice();
        }

        return { message: 'Khong co san pham nao' };
    }
    @Post('/them-moi-san-pham')
    async createProduct(@Body() newProductDto: newProductDto): Promise<Product> {
        return this.productservice.create(newProductDto);
    }
    @Put('/update-type-san-pham')
    async updateProduct(@Body() updateProductDto: updatetypeDto): Promise<{ message: string }> {
        return this.productservice.UpdateTypeByName(updateProductDto);
    }
    @Delete('/xoa-san-pham-theo-ten')
    async DeleteByName(@Query('name') name: string): Promise<{ message: string }> {
        return this.productservice.DeleteByName(name);
    }
}