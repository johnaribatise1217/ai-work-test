import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './Exception/GlobalExceptionFilter';
import { DatabaseExceptionFilter } from './Exception/DatabaseExceptionFilter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new DatabaseExceptionFilter()
  )
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

bootstrap();
