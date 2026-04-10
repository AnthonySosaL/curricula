import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';

type PrismaClientLike = {
  user: unknown;
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $transaction(args: any): Promise<any>;
};

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private client: PrismaClientLike | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get user(): any {
    if (!this.client) throw new Error('Database not available');
    return this.client.user;
  }

  async $connect() {
    if (this.client) await this.client.$connect();
  }

  async $disconnect() {
    if (this.client) await this.client.$disconnect();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async $transaction(args: any) {
    if (!this.client) throw new Error('Database not available');
    return this.client.$transaction(args);
  }

  async onModuleInit() {
    try {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        this.logger.warn('DATABASE_URL not configured — DB features disabled');
        return;
      }

      // Dynamic requires prevent startup crash when packages aren't bundled
      // (e.g. Vercel ncc may not bundle @prisma/adapter-neon correctly)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaNeon } = require('@prisma/adapter-neon') as {
        PrismaNeon: new (opts: { connectionString: string }) => unknown;
      };
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { PrismaClient } = require('../../generated/prisma-client') as {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        PrismaClient: new (opts: any) => PrismaClientLike;
      };

      const adapter = new PrismaNeon({ connectionString });
      this.client = new PrismaClient({ adapter });
      await this.client.$connect();
      this.logger.log('Conectado a Neon PostgreSQL');
    } catch (err) {
      this.logger.warn(`Prisma init failed: ${String(err)} — DB features disabled`);
    }
  }

  async onModuleDestroy() {
    if (this.client) await this.client.$disconnect();
  }
}
