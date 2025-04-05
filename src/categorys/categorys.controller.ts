import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategorysService } from './categorys.service';
import { newCategoryDto } from './dto/newCategory.dto';
import { Categorys } from './schema/category.schema';
import { updateNameCategoryDto } from './dto/updateNameCategory.dto';
import { deleteCategoryDto } from './dto/deleCategory.dto';
import { query } from 'express';

@Controller('categorys')
@ApiTags('Categorys')
export class CategorysController {
    constructor(private readonly categorysService: CategorysService) {}
    @Get('/tat-ca-loai-san-pham')
    async findAllCategorys(): Promise<Categorys[]> {
        return await this.categorysService.FindAllCategorys();
    }
    @Post('/them-moi-loai-san-pham')
    async createCategory(@Body() newCategoryDto: newCategoryDto): Promise<Categorys> {
        return await this.categorysService.CreateCategorys(newCategoryDto);
    }
    @Put('/cap-nhat-loai-san-pham-theo-ten')
    async updateCategory(@Query('name') name:string,@Query('NewName')NewName:string): Promise<{ message: string }> {
        return await this.categorysService.UpdateCategoryByName(name,NewName);
    }
    @Delete('/xoa-loai-san-pham-theo-ten')
    async deleteCategory(@Query('name')name:string): Promise<{ message: string }> {
        return await this.categorysService.DeleteCategoryByName(name);
    }
}
