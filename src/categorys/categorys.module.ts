import { Module } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CategorysController } from './categorys.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorysSchema,Categorys  } from './schema/category.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:Categorys.name,schema: CategorysSchema}])],
  providers: [CategorysService],
  controllers: [CategorysController],
  exports: [MongooseModule],
})
export class CategorysModule {
}
