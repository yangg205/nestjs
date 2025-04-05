import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { Product } from "src/products/schema/product.schema";

export type CartDocument = Cart & Document;

@Schema()
export class Cart {
    @Prop({ required: true })
    name: string;
    
    @Prop([{
        _id: false,//khong can tao id cho moi thanh phan trong mang
        product: { type: Types.ObjectId, ref: 'Product', required: true },  
        quantity: { type: Number, default: 1 },
    }])
    products: { product: Types.ObjectId, quantity: number }[];

    @Prop()
    totalPrice: number;
}


export const CartSchema = SchemaFactory.createForClass(Cart);
