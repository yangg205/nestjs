import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
declare const module: any;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //cau hinh swagger
  const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('Danh sách API')
  .setVersion('1.0')
  .addBearerAuth()//them xac thuc jwt
  .build();

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('swagger',app,document);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
