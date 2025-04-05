import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schema/cart.schema';
import { Model, Types } from 'mongoose';
import { NewCartDto } from './dto/newcart.dto';
import { Product, ProductDocument } from 'src/products/schema/product.schema';
import { merge } from 'rxjs';
import { DeleteCartDto } from './dto/deleCart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private CartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) { }
  async addCart(newCartDto: NewCartDto): Promise<{message: string}> {
    try {
      const { name, products } = newCartDto;
      const checkname = await this.CartModel.findOne({ name });
      if (checkname) {
        throw new HttpException('Gio hang da ton tai', 400);
      }
      const productIds = products.map((product) => product.productId);
      const productsInDb = await this.productModel.find({ _id: { $in: productIds } });
      if (productsInDb.length !== productIds.length) {
        throw new HttpException('San pham khong ton tai', 400);
      }
      const calculatedTotalPrice = productsInDb.reduce((total, product) => {
        const productInCart = products.find(item =>
          item.productId.toString() === product._id.toString()
        );
      
        if (!productInCart) return total;
        const quantity = productInCart.quantity || 1;
        const price = product.price || 0;
        return total + price * quantity;
      }, 0);
      const cart = new this.CartModel({
        name,
        products: products.map(product => ({
          product: product.productId,
          quantity: product.quantity||1,
        })),
        totalPrice: calculatedTotalPrice,
      });
      await cart.save();
      return await {message: 'Da tao gio hang thanh cong'};
    } catch (error) {
      console.log('loi khi tao gio hang:', error);
      throw new HttpException(error.message, 500);
    }
  }
  
  //cap nhat gio hang
  async updateCart(newCartDto: NewCartDto): Promise<{ message: string }> {
    try {
      const { name, products } = newCartDto;
      const cart = await this.CartModel.findOne({ name });
      if (!cart) {
        throw new HttpException('Gio hang khong ton tai', 404);
      }
      const productIds = products.map((product) => product.productId);
      const productsInDb = await this.productModel.find({ _id: { $in: productIds } });
      if (productsInDb.length !== productIds.length) {
        throw new HttpException('San pham khong ton tai', 400);
      }

      let totalPriceDifference = 0;
      products.forEach((product) => {
        const productInCart = cart.products.find(
          (item) => item.product.toString() === product.productId.toString()
        );
  
        const productInDb = productsInDb.find(
          (dbProduct) => dbProduct._id.toString() === product.productId.toString()
        );
        const productPrice = productInDb ? productInDb.price : 0;
        const productQuantity = product.quantity || 1;
  
        if (productInCart) {
          const oldQuantity = productInCart.quantity;
          productInCart.quantity += productQuantity;
          totalPriceDifference += (productInCart.quantity - oldQuantity) * productPrice;
        } else {
          cart.products.push({
            product: product.productId,
            quantity: productQuantity,
          });
          totalPriceDifference += productQuantity * productPrice;
        }
      });
      cart.totalPrice += totalPriceDifference;
      await cart.save();
      return { message: 'Da cap nhat gio hang thanh cong' };
    } catch (error) {
      console.log('Loi khi cap nhat gio hang:', error);
      throw new HttpException(error.message, 500);
    }
  }
  
  //lay toan bo gio hang
  async findAll(): Promise<Cart[]> {
    try{
      return await this.CartModel.find({},{'_id':0,'name':1,'products':1,'totalPrice':1}).populate({
        path: 'products.product',
        select: '-_id name price',
      }).exec();
    }
    catch (error) {
      console.log('loi khi lay danh sach gio hang:', error);
      throw new HttpException(error.message, 500);
    }
  }

  //xoa toan bo gio hang
  async deleteCartsByName(DeleteCartDto:DeleteCartDto): Promise<any> {
    try {
      const result = await this.CartModel.deleteOne({name:DeleteCartDto.name});
      if(result.deletedCount === 0){
        throw new HttpException('xoa that bai', 404);
      }
      return { message: 'Da xoa gio hang thanh cong' };
    } catch (error) {
      console.log('loi khi xoa toan bo gio hang:', error);
      throw new HttpException(error.message, 500);
    }
  }
}
