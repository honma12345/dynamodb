import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import { AppLogger } from './core/logger/app-logger.service';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.APP_ENV === 'local' || process.env.APP_ENV === 'dev' ? console : false,
  });
  app.useLogger(app.get(AppLogger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('DynamoDB API')
    .setDescription(`DynamoDB API`)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  document.servers = [
    {
      url: 'http://localhost:3100',
      description: 'ローカル',
    },
  ];
  fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
