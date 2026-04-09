import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Global API prefix — todas las rutas quedan bajo /api/*
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: config.get<string>('cors.origin'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Filtros globales — formato uniforme de errores
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor global — envuelve respuestas en { data, timestamp }
  app.useGlobalInterceptors(new TransformInterceptor());

  const port = config.get<number>('port') ?? 3001;
  await app.listen(port);
  console.log(`Backend corriendo en http://localhost:${port}/api`);
}
bootstrap();
