import { ValidationPipe } from '@nestjs/common';

// Reutilizable para registrar en main.ts o en controladores específicos
export const globalValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: { enableImplicitConversion: true },
});
