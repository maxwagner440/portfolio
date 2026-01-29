import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'http://localhost:4200' });
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
  );
  const port = process.env.API_PORT ?? process.env.PORT ?? 3000;
  await app.listen(port);
}
bootstrap();
