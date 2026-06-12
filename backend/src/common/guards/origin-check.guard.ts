import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { getAllowedOrigins } from '../security/allowed-origins';

/**
 * Exige que las peticiones con efectos (POST/PUT/PATCH/DELETE) traigan un
 * header Origin (o Referer) del frontend publicado. Los navegadores siempre
 * lo envian en peticiones cross-origin; los scripts genericos no.
 * No sustituye al rate limiting ni a la autenticacion: es una capa mas.
 */
@Injectable()
export class OriginCheckGuard implements CanActivate {
  private readonly allowed = getAllowedOrigins();

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const method = req.method.toUpperCase();
    if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') return true;

    const origin = (req.headers.origin ?? '').replace(/\/+$/, '');
    if (origin && this.allowed.includes(origin)) return true;

    const referer = req.headers.referer ?? '';
    if (this.allowed.some((o) => referer === o || referer.startsWith(`${o}/`))) return true;

    throw new ForbiddenException('Origen no permitido');
  }
}
