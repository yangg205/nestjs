import { Body, Controller, Delete, Get, Post, Put } from "@nestjs/common";
import { ProductService } from "./product.service";
import { Product } from "./schema/product.schema";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { updatetypeDto } from "src/products/dto/updatetype.dto";
import { newProductDto } from "./dto/newProduct.dto";
import { deleteProductDto } from "./dto/deleProduct.dto";
import { PriceProductDto } from "./dto/priceProduct.dto";
import { AboutPriceProductDto } from "./dto/aboutpriceProduct.dto";
import { NameCategoryDto } from "./dto/nameCategory.dto";

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
    async DeleteByName(@Body() deleteProductDto: deleteProductDto):Promise<{message: string}>{
        return this.productservice.DeleteByName(deleteProductDto);
    }
    @Post('/tim-kiem-theo-ten')
    async findByName(@Body() deleteProductDto:deleteProductDto): Promise<Product[]> {
        return await this.productservice.FindByName(deleteProductDto);
    }
    @Post('/tim-kiem-theo-gia')
    async findByPrice(@Body() priceProductDto: PriceProductDto): Promise<Product[]> {
        return await this.productservice.FindByPrice(priceProductDto);
    }
    @Post('/tim-kiem-theo-gia-cao-hon')
    async findByPriceHigher(@Body() priceProductDto: PriceProductDto): Promise<Product[]> {
        return await this.productservice.FindByHigherPrice(priceProductDto);
    }
    @Post('/tim-kiem-theo-gia-thap-hon')
    async findByPriceLower(@Body() priceProductDto: PriceProductDto): Promise<Product[]> {
        return await this.productservice.FindByPriceLess(priceProductDto);
    }
    @Post('/tim-kiem-theo-khoang-gia')
    async findByPriceRange(@Body() aboutPriceProductDto: AboutPriceProductDto): Promise<Product[]> {
        return await this.productservice.FindByPriceAbout(aboutPriceProductDto);
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