import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { getAllowedOrigins } from './common/security/allowed-origins';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  // Detras del proxy de Render: req.ip = IP real del cliente (clave para rate limiting)
  app.set('trust proxy', 1);

  // Headers de seguridad estandar
  app.use(helmet());

  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.length === 0) {
    console.warn('ADVERTENCIA: sin origenes permitidos configurados (FRONTEND_URL). CORS bloqueara todo.');
  }

  app.enableCors({
    origin: allowedOrigins,
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Valida y limpia TODOS los payloads segun los decoradores de los DTOs:
  // whitelist elimina campos no declarados (p. ej. inyectar "role" en updates)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Render requires binding to 0.0.0.0
  const port = parseInt(process.env['PORT'] ?? '3001', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`Backend corriendo en http://localhost:${port}/api`);
}

void bootstrap();
