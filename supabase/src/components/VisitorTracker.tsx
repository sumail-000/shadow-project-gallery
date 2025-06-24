
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

export const VisitorTracker = () => {
  const location = useLocation();
  const { trackPageVisit } = useAnalytics();

  useEffect(() => {
    // Track page visit whenever route changes
    trackPageVisit(location.pathname);
  }, [location.pathname, trackPageVisit]);

  return null; // This component doesn't render anything
};
