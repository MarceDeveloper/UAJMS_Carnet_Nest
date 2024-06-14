import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { PrismaExceptionFilter, PrismaExceptionFilter_with_logger } from './common/filters/prisma-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('tiny'));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true,
  }));

  app.useGlobalFilters(new PrismaExceptionFilter_with_logger()); // Use the custom exception filter globally

  await app.listen(3000);
}
bootstrap();
