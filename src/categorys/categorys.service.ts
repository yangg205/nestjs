import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categorys, CategorysDocument } from './schema/category.schema';
import { Model } from 'mongoose';
import { newCategoryDto } from './dto/newCategory.dto';
import { updateNameCategoryDto } from './dto/updateNameCategory.dto';
import { deleteCategoryDto } from './dto/deleCategory.dto';

@Injectable()
export class CategorysService {
    constructor(@InjectModel(Categorys.name) private CategorysModel: Model<CategorysDocument>) { }
    async CreateCategorys(newCategoryDto: newCategoryDto): Promise<Categorys> {
        try {
            const checkname = this.CategorysModel.findOne({ name: newCategoryDto.name });
            if (!checkname) {
                throw new HttpException('loai san pham da ton tai', 400)
            }
            const newCategory = await new this.CategorysModel(newCategoryDto);
            return newCategory.save();
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }
    async FindAllCategorys(): Promise<Categorys[]> {
        try {
            return await this.CategorysModel.find({}, { _id: 1, name: 1 }).exec();
        }
        catch (error) {
            throw new HttpException(error.message, 500)
        }
    }
    async UpdateCategoryByName(updateNameCategoryDto: updateNameCategoryDto): Promise<{ message: string }> {
        try{
            const checkname = await this.CategorysModel.findOne({name:updateNameCategoryDto.name});
            if(!checkname){
                throw new HttpException('loai san pham khong ton tai',404);
            }
            const updateCategory = await this.CategorysModel.updateOne(
                {name:updateNameCategoryDto.name},
                {$set:{name:updateNameCategoryDto.newName}}
            );
            if(updateCategory.modifiedCount===0){
                throw new HttpException('cap nhat that bai',500);
            }
            return {message: "cap nhat thanh cong"};
        }
        catch(error){
            console.log(error);
            throw new HttpException(error.message,500);
        }
    }
    async DeleteCategoryByName(deleteCategoryDto: deleteCategoryDto): Promise<{ message: string }> {
        try {
            const deleteCategory = await this.CategorysModel.deleteOne({ name: deleteCategoryDto.name });
            if (deleteCategory.deletedCount === 0) {
                throw new HttpException('xoa that bai', 500);
            }
            return { message: "xoa thanh cong" };
        }
        catch (error) {
            console.log(error);
            throw new HttpException(error.message, 500);
        }
    }
}
