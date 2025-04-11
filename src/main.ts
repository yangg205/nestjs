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
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Tự động chuyển đổi kiểu dữ liệu (chuỗi thành số, v.v.)
    transformOptions: { enableImplicitConversion: true }, // Cho phép chuyển đổi ngầm
    skipMissingProperties: true, // Bỏ qua các thuộc tính không được gửi
  }),);
  await app.listen(3002);
}
bootstrap();
