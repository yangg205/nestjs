import { Prop, Schema,SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document, Types } from "mongoose";
import { Categorys } from "src/categorys/schema/category.schema";

export type ProductDocument = Product & Document;
@Schema()
export class Product{
    @Prop({required: true})
    name: string;
    @Prop({required: true,ref:Categorys.name})
    type: Types.ObjectId;
    @Prop({required: true})
    price: number;
}
export const ProductSchema = SchemaFactory.createForClass(Product)