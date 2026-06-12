import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AnalyticsService, AnalyticsSummary } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Get('public-summary')
  async getPublicSummary(@Query('days') days?: string): Promise<AnalyticsSummary> {
    const parsedDays = Number.isFinite(Number(days)) ? Number(days) : undefined;
    return this.analyticsService.getSummary(parsedDays);
  }

  // Anti spam de eventos: 30 por IP por minuto
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('events')
  async trackEvent(@Body() dto: TrackEventDto) {
    return this.analyticsService.trackEvent(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async getSummary(@Query('days') days?: string): Promise<AnalyticsSummary> {
    const parsedDays = Number.isFinite(Number(days)) ? Number(days) : undefined;
    return this.analyticsService.getSummary(parsedDays);
  }
}
