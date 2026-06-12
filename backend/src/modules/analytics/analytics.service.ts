import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TrackEventDto } from './dto/track-event.dto';

type AnalyticsEventType =
  | 'PORTFOLIO_VISIT'
  | 'AI_REQUEST'
  | 'AUTH_ENTRY_OPEN'
  | 'DASHBOARD_VIEW';

interface TrendPoint {
  day: string;
  visits: number;
  aiRequests: number;
}

interface RoleAggregate {
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  _count: { role: number };
}

export interface AnalyticsSummary {
  totals: {
    totalVisits: number;
    aiRequests: number;
    authEntryOpens: number;
    dashboardViews: number;
    totalUsers: number;
  };
  roles: {
    admins: number;
    instructors: number;
    students: number;
  };
  conversionRate: number;
  aiPerVisit: number;
  dashboardAdoption: number;
  lastVisitAt: string | null;
  trend: TrendPoint[];
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private analyticsStorageReady = false;

  private async ensureAnalyticsStorage() {
    if (this.analyticsStorageReady) return;

    await this.prisma.$executeRawUnsafe(`
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AnalyticsEventType') THEN
    CREATE TYPE "AnalyticsEventType" AS ENUM (
      'PORTFOLIO_VISIT',
      'AI_REQUEST',
      'AUTH_ENTRY_OPEN',
      'DASHBOARD_VIEW'
    );
  END IF;
END $$;
    `);

    await this.prisma.$executeRawUnsafe(`
CREATE TABLE IF NOT EXISTS "analytics_events" (
  "id" TEXT NOT NULL,
  "type" "AnalyticsEventType" NOT NULL,
  "path" TEXT,
  "source" TEXT,
  "meta" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);
    `);

    await this.prisma.$executeRawUnsafe(
      'CREATE INDEX IF NOT EXISTS "analytics_events_type_createdAt_idx" ON "analytics_events"("type", "createdAt")',
    );
    await this.prisma.$executeRawUnsafe(
      'CREATE INDEX IF NOT EXISTS "analytics_events_createdAt_idx" ON "analytics_events"("createdAt")',
    );

    this.analyticsStorageReady = true;
  }

  private emptySummary(days: number): AnalyticsSummary {
    const now = new Date();
    const trend: TrendPoint[] = [];
    for (let i = days - 1; i >= 0; i -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      trend.push({ day: date.toISOString().slice(5, 10), visits: 0, aiRequests: 0 });
    }

    return {
      totals: {
        totalVisits: 0,
        aiRequests: 0,
        authEntryOpens: 0,
        dashboardViews: 0,
        totalUsers: 0,
      },
      roles: {
        admins: 0,
        instructors: 0,
        students: 0,
      },
      conversionRate: 0,
      aiPerVisit: 0,
      dashboardAdoption: 0,
      lastVisitAt: null,
      trend,
    };
  }

  async trackEvent(dto: TrackEventDto) {
    await this.ensureAnalyticsStorage();

    try {
      return await this.prisma.analyticsEvent.create({
        data: {
          type: dto.type,
          path: dto.path,
          source: dto.source,
          meta: dto.meta,
        },
        select: { id: true },
      });
    } catch (error) {
      const id = randomUUID();
      const meta = JSON.stringify(dto.meta ?? {});

      await this.prisma.$executeRawUnsafe(
        'INSERT INTO "analytics_events" ("id", "type", "path", "source", "meta", "createdAt") VALUES ($1, $2::"AnalyticsEventType", $3, $4, $5::jsonb, NOW())',
        id,
        dto.type,
        dto.path ?? null,
        dto.source ?? null,
        meta,
      );

      console.warn('TrackEvent used SQL fallback:', String(error));
      return { id };
    }
  }

  private buildTrend(
    events: { type: AnalyticsEventType; createdAt: Date }[],
    days: number,
  ): TrendPoint[] {
    const now = new Date();
    const trendMap = new Map<string, TrendPoint>();

    for (let i = days - 1; i >= 0; i -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const key = date.toISOString().slice(0, 10);
      trendMap.set(key, {
        day: key.slice(5),
        visits: 0,
        aiRequests: 0,
      });
    }

    events.forEach((event) => {
      const key = event.createdAt.toISOString().slice(0, 10);
      const current = trendMap.get(key);
      if (!current) return;
      if (event.type === 'PORTFOLIO_VISIT') current.visits += 1;
      if (event.type === 'AI_REQUEST') current.aiRequests += 1;
    });

    return Array.from(trendMap.values());
  }

  async getSummary(days = 7): Promise<AnalyticsSummary> {
    try {
      await this.ensureAnalyticsStorage();
    } catch (error) {
      console.warn('Analytics storage bootstrap failed:', String(error));
    }

    const safeDays = Math.max(3, Math.min(30, days));
    const since = new Date();
    since.setDate(since.getDate() - (safeDays - 1));
    since.setHours(0, 0, 0, 0);

    const fallback = this.emptySummary(safeDays);

    let totalVisits = 0;
    let aiRequests = 0;
    let authEntryOpens = 0;
    let dashboardViews = 0;
    let lastVisit: { createdAt: Date } | null = null;
    let recentEvents: { type: AnalyticsEventType; createdAt: Date }[] = [];

    try {
      [
        totalVisits,
        aiRequests,
        authEntryOpens,
        dashboardViews,
        lastVisit,
        recentEvents,
      ] = await Promise.all([
        this.prisma.analyticsEvent.count({ where: { type: 'PORTFOLIO_VISIT' } }),
        this.prisma.analyticsEvent.count({ where: { type: 'AI_REQUEST' } }),
        this.prisma.analyticsEvent.count({ where: { type: 'AUTH_ENTRY_OPEN' } }),
        this.prisma.analyticsEvent.count({ where: { type: 'DASHBOARD_VIEW' } }),
        this.prisma.analyticsEvent.findFirst({
          where: { type: 'PORTFOLIO_VISIT' },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
        this.prisma.analyticsEvent.findMany({
          where: { createdAt: { gte: since } },
          select: { type: true, createdAt: true },
        }),
      ]);
    } catch (error) {
      console.warn('Analytics queries failed, trying SQL fallback:', String(error));

      const [
        visitsRows,
        aiRows,
        authRows,
        dashboardRows,
        lastVisitRows,
        recentRows,
      ] = await Promise.all([
        this.prisma.$queryRawUnsafe('SELECT COUNT(*)::int AS count FROM "analytics_events" WHERE "type" = $1::"AnalyticsEventType"', 'PORTFOLIO_VISIT'),
        this.prisma.$queryRawUnsafe('SELECT COUNT(*)::int AS count FROM "analytics_events" WHERE "type" = $1::"AnalyticsEventType"', 'AI_REQUEST'),
        this.prisma.$queryRawUnsafe('SELECT COUNT(*)::int AS count FROM "analytics_events" WHERE "type" = $1::"AnalyticsEventType"', 'AUTH_ENTRY_OPEN'),
        this.prisma.$queryRawUnsafe('SELECT COUNT(*)::int AS count FROM "analytics_events" WHERE "type" = $1::"AnalyticsEventType"', 'DASHBOARD_VIEW'),
        this.prisma.$queryRawUnsafe('SELECT "createdAt" FROM "analytics_events" WHERE "type" = $1::"AnalyticsEventType" ORDER BY "createdAt" DESC LIMIT 1', 'PORTFOLIO_VISIT'),
        this.prisma.$queryRawUnsafe('SELECT "type", "createdAt" FROM "analytics_events" WHERE "createdAt" >= $1', since),
      ]);

      const parseCount = (rows: unknown): number => {
        const first = (rows as Array<{ count?: number }>)[0];
        return Number(first?.count ?? 0);
      };

      totalVisits = parseCount(visitsRows);
      aiRequests = parseCount(aiRows);
      authEntryOpens = parseCount(authRows);
      dashboardViews = parseCount(dashboardRows);

      const lastVisitRow = (lastVisitRows as Array<{ createdAt?: Date }>)[0];
      lastVisit = lastVisitRow?.createdAt ? { createdAt: new Date(lastVisitRow.createdAt) } : null;

      recentEvents = (recentRows as Array<{ type: AnalyticsEventType; createdAt: Date }>).map((row) => ({
        type: row.type,
        createdAt: new Date(row.createdAt),
      }));
    }

    let usersByRole: RoleAggregate[] = [];
    try {
      usersByRole = (await this.prisma.user.groupBy({
        by: ['role'],
        _count: { role: true },
      })) as RoleAggregate[];
    } catch (error) {
      console.warn('Users role aggregation failed, returning fallback users:', String(error));
      usersByRole = [];
    }

    const typedUsersByRole = usersByRole;

    const totalUsers = typedUsersByRole.reduce((acc, item) => acc + item._count.role, 0);
    const admins = typedUsersByRole.find((item) => item.role === 'ADMIN')?._count.role ?? 0;
    const instructors = typedUsersByRole.find((item) => item.role === 'INSTRUCTOR')?._count.role ?? 0;
    const students = typedUsersByRole.find((item) => item.role === 'STUDENT')?._count.role ?? 0;

    const visitBase = Math.max(totalVisits, 1);
    const conversionRate = Number(((totalUsers / visitBase) * 100).toFixed(2));
    const aiPerVisit = Number((aiRequests / visitBase).toFixed(2));
    const dashboardAdoption = Number(((dashboardViews / visitBase) * 100).toFixed(2));

    return {
      totals: {
        totalVisits,
        aiRequests,
        authEntryOpens,
        dashboardViews,
        totalUsers,
      },
      roles: {
        admins,
        instructors,
        students,
      },
      conversionRate,
      aiPerVisit,
      dashboardAdoption,
      lastVisitAt: lastVisit?.createdAt.toISOString() ?? null,
      trend: recentEvents.length > 0 ? this.buildTrend(recentEvents, safeDays) : fallback.trend,
    };
  }
}
