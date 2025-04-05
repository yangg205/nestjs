import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import mongoose, { Mongoose } from "mongoose";
import {MongooseModule} from '@nestjs/mongoose';
import { Product, ProductSchema } from "./schema/product.schema";
import { Categorys } from "src/categorys/schema/category.schema";
import { CategorysModule } from "src/categorys/categorys.module";

@Module({
imports:[MongooseModule.forFeature([{name:Product.name,schema: ProductSchema}]),CategorysModule],
controllers: [ProductController],
providers: [ProductService],
exports: [MongooseModule],
})

export class ProductModule{};
