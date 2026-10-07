import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AnalyticsSummaryResponse, AnalyticsTimelineResponse } from '@/types/api';

export function useAnalyticsTimeline(days: number) {
  return useQuery({
    queryKey: ['analytics', 'timeline', days],
    queryFn: () =>
      api
        .get<AnalyticsTimelineResponse>('/analytics/timeline', { params: { days } })
        .then((r) => r.data),
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 1,
  });
}

export function useAnalyticsSummary(enabled = true, isPublic = false) {
  return useQuery({
    queryKey: ['analytics', isPublic ? 'public-summary' : 'summary'],
    queryFn: () =>
      api
        .get<AnalyticsSummaryResponse>(isPublic ? '/analytics/public-summary' : '/analytics/summary')
        .then((r) => r.data),
    enabled,
    staleTime: 0,
    refetchInterval: enabled ? 15000 : false,
    retry: 1,
  });
}
