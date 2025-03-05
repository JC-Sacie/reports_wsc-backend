import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.setViewEngine('hbs');
  //app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  //app.useLogger(new CustomLogger());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
