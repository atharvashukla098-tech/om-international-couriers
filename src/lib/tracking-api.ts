export interface DocketEvent {
  event_description: string;
  event_at: string;
  event_location: string;
  event_remark?: string;
}

export interface TrackingResult {
  success: boolean;
  trackingNo: string;
  forwardingNo?: string;
  referenceNo?: string;
  status: string;
  bookedDate?: string;
  consignee?: string;
  destination?: string;
  pieces?: string | number;
  weight?: string | number;
  deliveredDate?: string;
  podImage?: string;
  events: DocketEvent[];
  error?: string;
  isDemo?: boolean;
}

export type TrackingSearchType = 'tracking_no' | 'forwarding_no1' | 'reference_no';

export async function queryTracking(query: string, type: TrackingSearchType = 'tracking_no'): Promise<TrackingResult> {
  const cleanQuery = query.trim();
  if (!cleanQuery) {
    return {
      success: false,
      trackingNo: '',
      status: 'Error',
      events: [],
      error: 'Please enter a valid tracking number.',
    };
  }

  try {
    const res = await fetch(`/api/tracking?query=${encodeURIComponent(cleanQuery)}&type=${type}`);
    if (res.status === 429) {
      return {
        success: false,
        trackingNo: cleanQuery,
        status: 'Rate Limited',
        events: [],
        error: 'Too many queries. Please wait 30 seconds before searching again.',
      };
    }
    const data: TrackingResult = await res.json();
    return data;
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unable to connect to OM Tracking System. Please try again.';
    return {
      success: false,
      trackingNo: cleanQuery,
      status: 'Network Error',
      events: [],
      error: errorMsg,
    };
  }

}
