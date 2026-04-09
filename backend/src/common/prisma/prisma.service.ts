import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma-client';
import { PrismaNeon } from '@prisma/adapter-neon';

function buildClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL no está configurado');
  const adapter = new PrismaNeon({ connectionString });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly client: PrismaClient;

  constructor() {
    this.client = buildClient();
  }

  // Proxy: delega todas las propiedades al PrismaClient interno
  // Permite usar this.prisma.user.findMany() en los repositories
  get user() { return this.client.user; }

  async $connect() { return this.client.$connect(); }
  async $disconnect() { return this.client.$disconnect(); }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async $transaction(args: any) { return this.client.$transaction(args); }

  async onModuleInit() {
    await this.client.$connect();
    this.logger.log('Conectado a Neon PostgreSQL');
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
