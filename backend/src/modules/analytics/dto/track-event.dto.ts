import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

const EVENT_TYPES = ['PORTFOLIO_VISIT', 'AI_REQUEST', 'AUTH_ENTRY_OPEN', 'DASHBOARD_VIEW'] as const;

type AnalyticsEventType = (typeof EVENT_TYPES)[number];

export class TrackEventDto {
  @IsIn(EVENT_TYPES)
  type: AnalyticsEventType;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  source?: string;

  @IsOptional()
  @IsObject()
  meta?: Record<string, unknown>;
}
