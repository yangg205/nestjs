import { Body, Controller, Delete, Get, Post, Put, Query } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./schema/product.schema";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { updatetypeDto } from "src/products/dto/updatetype.dto";
import { newProductDto } from "./dto/newProduct.dto";
import { deleteProductDto } from "./dto/deleProduct.dto";
import { PriceProductDto } from "./dto/priceProduct.dto";
import { AboutPriceProductDto } from "./dto/aboutpriceProduct.dto";
import { NameCategoryDto } from "./dto/nameCategory.dto";
import { query } from "express";

@Controller('products')
@ApiTags('Products')
export class ProductController{
    constructor(private readonly productservice:ProductService){}
    @Get('/tat-ca-san-pham')
    async findall():Promise<Product[]>{
        return this.productservice.FindAll();
    }
    @Post('/them-moi-san-pham')
    async createProduct(@Body() newProductDto: newProductDto):Promise<Product>{
        return this.productservice.create(newProductDto);
    }
    @Put('/update-type-san-pham')
    async updateProduct(@Body() updateProductDto: updatetypeDto): Promise<{ message: string }> {
        return this.productservice.UpdateTypeByName(updateProductDto);
    }
    @Delete('/xoa-san-pham-theo-ten')
    async DeleteByName(@Query('name') name:string):Promise<{message: string}>{
        return this.productservice.DeleteByName(name);
    }
    @Get('/tim-kiem-theo-ten')
    async findByName(@Query('name') name:string): Promise<Product[]> {
        return await this.productservice.FindByName(name);
    }
    @Get('/tim-kiem-theo-gia')
    async findByPrice(@Query('price') price:number): Promise<Product[]> {
        return await this.productservice.FindByPrice(price);
    }
    @Get('/tim-kiem-theo-gia-cao-hon')
    async findByPriceHigher(@Query('price') price:number): Promise<Product[]> {
        return await this.productservice.FindByHigherPrice(price);
    }
    @Get('/tim-kiem-theo-gia-thap-hon')
    async findByPriceLower(@Query('price') price:number): Promise<Product[]> {
        return await this.productservice.FindByPriceLess(price);
    }
    @Get('/tim-kiem-theo-khoang-gia')
    async findByPriceRange(@Query('StartPrice') StartPrice:number, @Query('EndPrice') EndPrice:number): Promise<Product[]> {
        return await this.productservice.FindByPriceAbout(StartPrice, EndPrice);
    }
    @Get('/san-pham-gia-cao-nhat')
    async findMaxPrice(): Promise<Product> {
        return await this.productservice.FindByHighestPrice();
    }
    @Get('/san-pham-gia-thap-nhat')
    async findMinPrice(): Promise<Product> {
        return await this.productservice.FindByLowestPrice();
    }
}