import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from '@nestjs/mongoose';
import { ProductModule } from './products/product.module';
import { CategorysModule } from './categorys/categorys.module';
import { CartModule } from './cart/cart.module';
@Module({
  // imports: [MongooseModule.forRoot('mongodb+srv://giangvvps41296:yangg2206@zanyang.4mbtzcv.mongodb.net/?retryWrites=true&w=majority&appName=zanyang'),
  imports: [MongooseModule.forRoot('mongodb+srv://giangvvps41296:yangg2206@zanyang.4mbtzcv.mongodb.net/?retryWrites=true&w=majority&appName=zanyang'),

            ProductModule,
            CategorysModule,
            CartModule,
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
