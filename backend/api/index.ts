import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import express from 'express';
import type { Express } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

// Cache the Express instance across warm serverless invocations
let cachedServer: Express | null = null;

async function bootstrap(): Promise<Express> {
  if (cachedServer) return cachedServer;

  const expressApp = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp), {
    logger: ['error', 'warn'],
  });

  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: config.get<string>('cors.origin') ?? '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ValidationPipe disabled — class-validator not available in Lambda runtime

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.init();

  cachedServer = expressApp;
  return cachedServer;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const server = await bootstrap();
    server(req as any, res as any);
  } catch (err) {
    console.error('Bootstrap error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Server failed to initialize', details: String(err) }));
  }
}
