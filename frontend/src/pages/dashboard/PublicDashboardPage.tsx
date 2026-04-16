import { useEffect } from 'react';
import { BusinessDashboard } from '@/components/dashboard/BusinessDashboard';
import { recordMetric } from '@/lib/analytics';

export default function PublicDashboardPage() {
  useEffect(() => {
    recordMetric('DASHBOARD_VIEW');
  }, []);

  return <BusinessDashboard publicView />;
}
