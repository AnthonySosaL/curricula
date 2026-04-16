import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AnalyticsSummaryResponse } from '@/types/api';

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
