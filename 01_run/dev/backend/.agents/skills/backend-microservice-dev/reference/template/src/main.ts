import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // El DomainExceptionFilter ya se registra como APP_FILTER dentro de
  // OrderModule. Si se prefiere centralizar el registro de filtros aquí
  // en vez de en cada módulo, se puede quitar el provider APP_FILTER de
  // OrderModule y descomentar la siguiente línea:
  // app.useGlobalFilters(new DomainExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
