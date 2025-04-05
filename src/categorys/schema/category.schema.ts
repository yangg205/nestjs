import { Prop, Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CategorysDocument = Categorys & Document;
@Schema()
export class Categorys{
    @Prop({required: true})
    name: string;
}
export const CategorysSchema = SchemaFactory.createForClass(Categorys)