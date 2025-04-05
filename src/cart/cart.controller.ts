import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './schema/cart.schema';
import { NewCartDto } from './dto/newcart.dto';
import { DeleteCartDto } from './dto/deleCart.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}
    @Get('/lay-toan-bo-gio-hang')
    async getAllCarts(): Promise<Cart[]> {
        return await this.cartService.findAll();
    }
    @Post('/create-cart')
    async createCart(@Body() newCartDto:NewCartDto): Promise<{message: string}> {
        return await this.cartService.addCart(newCartDto);
    }
    @Put('/cap-nhat-gio-hang')
    async updateCart(@Body() newCartDto: NewCartDto): Promise<{message: string}> {
        return await this.cartService.updateCart(newCartDto);
    }
    @Delete('/xoa-gio-hang-bang-ten')
    async deleteCartsByName(@Query('name') name:string): Promise<any> {
        return await this.cartService.deleteCartsByName(name);
    }
}
