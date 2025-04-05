import { Injectable, HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument } from "./schema/product.schema";
import { isValidObjectId, Model, Types } from "mongoose";
import { updatetypeDto } from "src/products/dto/updatetype.dto";
import { newProductDto } from "./dto/newProduct.dto";
import { deleteProductDto } from "./dto/deleProduct.dto";
import { PriceProductDto } from "./dto/priceProduct.dto";
import { AboutPriceProductDto } from "./dto/aboutpriceProduct.dto";
import { NameCategoryDto } from "./dto/nameCategory.dto";
import { Categorys } from "src/categorys/schema/category.schema";


@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>, @InjectModel(Categorys.name) private categorysModel: Model<Categorys>) { }


    async create(newProductDto: newProductDto): Promise<Product> {
        try {
            const checkname = this.productModel.findOne({ name: newProductDto.name })
            if (!checkname) {
                // throw new NotFoundException('san pham da ton tai')
                throw new HttpException('san pham da ton tai', 400)
            }
            const newProduct = await new this.productModel(newProductDto);
            return newProduct.save();
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.messgae, 500)
        }
    }
    async FindAll(): Promise<Product[]> {
        try {
            return await this.productModel.find({}, { _id: 0, name: 1, price: 1 }).populate('type', '-_id').exec();
        }
        catch (error) {
            throw new HttpException(error.message, 500)
        }
    }
    async DeleteByName(name: string): Promise<{ message: string }> {
        try {
            const result = await this.productModel.deleteOne({ name: name });
            if (result.deletedCount === 0) {
                throw new HttpException('xoa that bai', 500);
            }
            return { message: "xoa thanh cong" };
        }
        catch (error) {
            console.log(error);
            throw new HttpException(error.message, 500);
        }
    }
    async UpdateTypeByName(updatetypeDto: updatetypeDto): Promise<{ message: string }> {
        try {
            const productname = await this.productModel.findOne({ name: updatetypeDto.name });
            if (!productname)
                throw new HttpException('san pham khong ton tai', 404);
            const updateType = await this.productModel.updateOne(
                { name: updatetypeDto.name },//dieu kien tim kiem theo ten
                { $set: { type: updatetypeDto.newType } }
            );
            //kiem tra co san pham nao duoc cap nhat khong
            if (updateType.modifiedCount === 0) {
                throw new HttpException('khong co thay doi nao duoc thuc hien', 404)
            }
            return { message: 'sua thanh cong' }
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }
    async FindByName(name:string): Promise<Product[]> {
        try {
            const nameRegex = new RegExp(name, 'i'); // 'i' de khong phan biet chu hoa va thuong
            const products = await this.productModel
                .find({ name: { $regex: nameRegex } })
                .populate('type', '-_id')
                .exec();
            if (products.length === 0) {
                throw new HttpException('san pham khong ton tai', 404);
            }
            return products;
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }
    async FindByPrice(price: number): Promise<Product[]> {
        try {
            const products = await this.productModel.find({ price: price }).populate('type', '-_id').exec();//tim san pham theo gia
            if (products.length === 0) {
                throw new HttpException('khong co san pham nao', 404)
            }
            return products;
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }
    async FindByHigherPrice(price:number): Promise<Product[]> {
        try {
            const products = await this.productModel.find({ price: { $gte: price } }).populate('type', '-_id').exec();//tim cac product lon hon gia nhap vao
            if (products.length === 0) {
                throw new HttpException('khong co san pham nao', 404)
            }
            return products;
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }
    async FindByHighestPrice(): Promise<Product> {
        try {
            const product = await this.productModel.findOne().sort({ price: -1 }).limit(1).populate('type', '-_id').exec();//tim san pham co gia cao nhat
            if (!product) {
                throw new HttpException('khong co san pham nao', 404)
            }
            return product;
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }
    async FindByLowestPrice(): Promise<Product> {
        try {
            const product = await this.productModel.findOne().sort({ price: 1 }).limit(1).populate('type', '-_id').exec();//tim san pham co gia thap nhat
            if (!product) {
                throw new HttpException('khong co san pham nao', 404)
            }
            return product;
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }
    async FindByPriceAbout(pricestart:number,priceend:number): Promise<Product[]> {
        try {
            //lte la nho hon hoac bang
            //gte la lon hon hoac bang
            //lt la nho hon
            //gt la lon hon
            const products = await this.productModel.find({ price: { $gte: pricestart, $lte: priceend } }).populate('type', '-_id').exec();//tim cac product nho hon gia nhap vao
            if (products.length === 0) {
                throw new HttpException('khong co san pham nao', 404)
            }
            return products;
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }
    async FindByPriceLess(price:number): Promise<Product[]> {
        try {
            const products = await this.productModel.find({ price: { $lte: price } }).populate('type', '-_id').exec();//tim cac product nho hon gia nhap vao
            if (products.length === 0) {
                throw new HttpException('khong co san pham nao', 404)
            }
            return products;
        }
        catch (error) {
            console.log(error)
            throw new HttpException(error.message, 500)
        }
    }

}
