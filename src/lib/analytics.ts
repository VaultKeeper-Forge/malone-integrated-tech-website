export type AnalyticsEvent = {
  action: string;
  section?: string;
  label?: string;
};

export const track = (payload: AnalyticsEvent): void => {
  if (typeof window === 'undefined') return;

  const event = {
    ...payload,
    ts: new Date().toISOString()
  };

  window.dispatchEvent(new CustomEvent('mit-event', { detail: event }));
  if (import.meta.env.DEV) {
    console.debug('[analytics-stub]', event);
  }
};
