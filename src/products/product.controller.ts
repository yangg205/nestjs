import { Controller, Get, Post, Put, Delete, Query, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { updatetypeDto } from './dto/updatetype.dto';
import { newProductDto } from './dto/newProduct.dto';
import { SearchProductDto } from './dto/SearchProduct.dto';

@Controller('products')
@ApiTags('Products')
export class ProductController {
    constructor(private readonly productservice: ProductService) { }
    @Get()
    @ApiOperation({ summary: 'Tìm kiếm sản phẩm với phân trang' })
    @ApiResponse({ status: 200, description: 'Danh sách sản phẩm' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
    async findProduct(@Query() query: SearchProductDto): Promise<{ products: Product[]; total: number }> {
        const { name, startPrice, endPrice, sort, page = 1, limit = 10 } = query;

        const filters: { name?: string; startPrice?: number; endPrice?: number } = {};

        if (name) filters.name = name;
        if (startPrice !== undefined && endPrice !== undefined) {
            filters.startPrice = startPrice;
            filters.endPrice = endPrice;
        }

        return this.productservice.findWithAggregation(filters, sort, page, limit);
    }
    @Post()
    @ApiOperation({ summary: 'Thêm sản phẩm mới' })
    async createProduct(@Body() newProductDto: newProductDto): Promise<Product> {
        return this.productservice.create(newProductDto);
    }
    @Put()
    @ApiOperation({ summary: 'Cập nhật loại sản phẩm' })
    async updateProduct(@Body() updateProductDto: updatetypeDto): Promise<{ message: string }> {
        return this.productservice.UpdateTypeByName(updateProductDto);
    }
    @Delete()
    @ApiOperation({ summary: 'Xóa sản phẩm theo tên' })
    @ApiQuery({ name: 'name', required: true })
    async DeleteByName(@Query('name') name: string): Promise<{ message: string }> {
        return this.productservice.DeleteByName(name);
    }
}