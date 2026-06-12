import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { join } from 'node:path';

type PrismaClientLike = {
  user: unknown;
  analyticsEvent: unknown;
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $transaction(args: any): Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $executeRawUnsafe(query: string, ...values: any[]): Promise<number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $queryRawUnsafe(query: string, ...values: any[]): Promise<any>;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get analyticsEvent(): any {
    if (!this.client) throw new Error('Database not available');
    return this.client.analyticsEvent;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async $executeRawUnsafe(query: string, ...values: any[]) {
    if (!this.client) throw new Error('Database not available');
    return this.client.$executeRawUnsafe(query, ...values);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async $queryRawUnsafe(query: string, ...values: any[]) {
    if (!this.client) throw new Error('Database not available');
    return this.client.$queryRawUnsafe(query, ...values);
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
      let prismaClientModule: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        PrismaClient: new (opts: any) => PrismaClientLike;
      } | null = null;

      const candidatePaths = [
        join(process.cwd(), 'src', 'generated', 'prisma-client'),
        '../../generated/prisma-client',
      ];

      for (const modulePath of candidatePaths) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          prismaClientModule = require(modulePath) as {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            PrismaClient: new (opts: any) => PrismaClientLike;
          };
          break;
        } catch {
          // Try next possible path.
        }
      }

      if (!prismaClientModule) {
        throw new Error('Cannot load PrismaClient module');
      }

      const adapter = new PrismaNeon({ connectionString });
      this.client = new prismaClientModule.PrismaClient({ adapter });
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
