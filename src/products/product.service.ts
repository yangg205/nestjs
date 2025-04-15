import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schema/product.schema';
import { Categorys } from 'src/categorys/schema/category.schema';
import { Model } from 'mongoose';
import { updatetypeDto } from './dto/updatetype.dto';
import { newProductDto } from './dto/newProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Categorys.name) private categorysModel: Model<Categorys>,
  ) {}

  async create(newProductDto: newProductDto): Promise<Product> {
    try {
      const checkname = await this.productModel.findOne({ name: newProductDto.name });
      if (checkname) {
        throw new HttpException('Sản phẩm đã tồn tại', HttpStatus.BAD_REQUEST);
      }
      const newProduct = new this.productModel(newProductDto);
      return newProduct.save();
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Tìm kiếm sản phẩm bằng aggregation với phân trang và sắp xếp
  async findWithAggregation(
    filters: {
      name?: string;
      startPrice?: number;
      endPrice?: number;
    },
    sort: 'asc' | 'desc' | undefined,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const pipeline: any[] = [];
      const matchStage: any = {};

      if (filters.name) {
        //regex để tìm kiếm trong mongodb theo dạng chuỗi ký tự
        matchStage.name = { $regex: filters.name, $options: 'i' };//option: 'i' để không phân biệt chữ hoa và chữ thường
      }

      if (filters.startPrice !== undefined && filters.endPrice !== undefined) {
        if (filters.startPrice === filters.endPrice) {
          matchStage.price = filters.startPrice;
        } else {
          matchStage.price = { $gte: filters.startPrice, $lte: filters.endPrice };
        }
      }

      // Thêm stage match vào pipeline nếu có bộ lọc
      if (Object.keys(matchStage).length > 0) {
        pipeline.push({ $match: matchStage });//$match lọc dữ liệu từ collection products dựa trên điều kiện.
      }

      // Liên kết với collection categorys để lấy thông tin type
      pipeline.push({
        $lookup: {
          from: 'categorys',
          localField: 'type',//Trường trong products
          foreignField: '_id',//Trường trong categorys để so khớp với trường type trong product
          as: 'type',
        },
      });
      pipeline.push({ $unwind: { path: '$type', preserveNullAndEmptyArrays: true } });
      pipeline.push({ $project: { 'type._id': 0 } });

      if (sort === 'asc') {
        pipeline.push({ $sort: { price: 1 } }); 
      } else if (sort === 'desc') {
        pipeline.push({ $sort: { price: -1 } }); 
      } else {
        pipeline.push({ $sort: { name: 1 } }); 
      }

      // Phân trang
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: limit });

      // Thực thi pipeline để lấy sản phẩm
      const products = await this.productModel.aggregate(pipeline).exec();
      // Tính tổng số sản phẩm
      const countPipeline = pipeline.filter((stage) => !('$skip' in stage) && !('$limit' in stage));
      countPipeline.push({ $count: 'total' });
      const countResult = await this.productModel.aggregate(countPipeline).exec();
      const total = countResult[0]?.total || 0;
      if (products.length === 0) {
        throw new HttpException('Không có sản phẩm nào', HttpStatus.NOT_FOUND);
      }

      return { products, total };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async DeleteByName(name: string): Promise<{ message: string }> {
    try {
      const result = await this.productModel.deleteOne({ name });
      if (result.deletedCount === 0) {
        throw new HttpException('Xóa thất bại', HttpStatus.NOT_FOUND);
      }
      return { message: 'Xóa thành công' };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async UpdateTypeByName(updatetypeDto: updatetypeDto): Promise<{ message: string }> {
    try {
      const productname = await this.productModel.findOne({ name: updatetypeDto.name });
      if (!productname) {
        throw new HttpException('Sản phẩm không tồn tại', HttpStatus.NOT_FOUND);
      }
      const updateType = await this.productModel.updateOne(
        { name: updatetypeDto.name },
        { $set: { type: updatetypeDto.newType } },
      );
      if (updateType.modifiedCount === 0) {
        throw new HttpException('Không có thay đổi nào được thực hiện', HttpStatus.BAD_REQUEST);
      }
      return { message: 'Sửa thành công' };
    } catch (error) {
      console.log(error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async FindAll(): Promise<Product[]> {
    try {
      return await this.productModel.find({}, { _id: 0, name: 1, price: 1 }).populate('type', '-_id').exec();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async FindByName(name: string): Promise<Product[]> {
    return this.findWithAggregation({ name }, undefined, 1, 10).then((result) => result.products);
  }

  async FindByPriceAbout(startPrice: number, endPrice: number): Promise<Product[]> {
    return this.findWithAggregation({ startPrice, endPrice }, undefined, 1, 10).then(
      (result) => result.products,
    );
  }
}