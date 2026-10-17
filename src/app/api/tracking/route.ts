import { NextResponse } from 'next/server';
import {
  checkRateLimit,
  getClientIp,
  isValidTrackingQuery,
  isValidSearchType,
  sanitizeString,
  secureJsonResponse,
} from '@/lib/security';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(request: Request) {
  // ── 1. Rate Limiting Protection (Max 30 requests / min / IP) ─────────────────
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(clientIp, { windowMs: 60 * 1000, maxRequests: 30 });

  if (!rateLimit.allowed) {
    return secureJsonResponse(
      {
        success: false,
        error: 'Too many requests. Please wait a moment before querying again.',
      },
      429,
      { 'Retry-After': String(rateLimit.resetInSec) }
    );
  }

  // ── 2. Request Parsing & Sanitization ────────────────────────────────────────
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get('query');
  const rawSearchType = searchParams.get('type') || 'tracking_no';

  if (!rawQuery) {
    return secureJsonResponse(
      { success: false, error: 'Query parameter is required' },
      400
    );
  }

  const query = sanitizeString(rawQuery.trim(), 64);
  const searchType = sanitizeString(rawSearchType.trim(), 32);

  // ── 3. Strict Input Validation (Prevent Injection & SSRF) ────────────────────
  if (!isValidTrackingQuery(query)) {
    return secureJsonResponse(
      {
        success: false,
        error: 'Invalid tracking number format. Use alphanumeric characters and standard delimiters only.',
      },
      400
    );
  }

  if (!isValidSearchType(searchType)) {
    return secureJsonResponse(
      {
        success: false,
        error: 'Invalid search type requested.',
      },
      400
    );
  }

  const normalized = query.toUpperCase();

  // ── 4. Demo Fallback for test IDs ────────────────────────────────────────────
  if (
    normalized === 'OM-8921-IN' ||
    normalized === 'DEMO' ||
    normalized === 'TEST' ||
    normalized === 'BOM-LHR'
  ) {
    return secureJsonResponse({
      success: true,
      trackingNo: 'OM-8921-IN',
      forwardingNo: 'FWD-99482103',
      referenceNo: 'REF-BOM-2026-X',
      status: 'In Transit',
      bookedDate: '2026-09-07 14:30:00',
      consignee: 'Apex Global Logistics UK Ltd',
      destination: 'London Heathrow (LHR), United Kingdom',
      pieces: '3 Cartons',
      weight: '42.50 KG',
      podImage: '',
      isDemo: true,
      events: [
        {
          event_description: 'Departed International Air Freight Transit',
          event_at: '2026-09-09 21:40:00',
          event_location: 'Dubai World Central (DWC)',
          event_remark: 'Flight EK-982 Connecting to LHR'
        },
        {
          event_description: 'Customs Cleared & Export Manifest Generated',
          event_at: '2026-09-08 19:15:00',
          event_location: 'Mumbai Air Cargo Complex (BOM)',
          event_remark: 'EDI Clearance Acknowledged'
        },
        {
          event_description: 'Consignment Weighed & X-Ray Scanned',
          event_at: '2026-09-08 11:20:00',
          event_location: 'OM International Central Sorting Hub, Mumbai',
          event_remark: 'Security tamper-seal verified'
        },
        {
          event_description: 'Shipment Picked Up from Consignor',
          event_at: '2026-09-07 16:00:00',
          event_location: 'Karel Wadi, Thakurdwar, Mumbai HQ',
          event_remark: 'Initial booking accepted'
        }
      ]
    });
  }

  // ── 5. Official Live Upstream API Call with Timeout & Sanitized URL ──────────
  const officialApiUrl = `https://admin.omcourier.in/api/tracking_api/get_tracking_data?${encodeURIComponent(
    searchType
  )}=${encodeURIComponent(
    query
  )}&customer_code=superadmin&company=OM-INTERNATIONAL-COURIER-CARGO-SERVICES&api_company_id=13`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8-sec strict timeout

    const apiRes = await fetch(officialApiUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'OM-Logistics-Platform/2.0 (Security-Hardened-Client)',
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    });

    clearTimeout(timeout);

    if (!apiRes.ok) {
      return secureJsonResponse({
        success: false,
        trackingNo: query,
        status: 'Unreachable',
        events: [],
        error: `Tracking service responded with status ${apiRes.status}`,
      });
    }

    const data = await apiRes.json();

    if (Array.isArray(data) && data.length > 0) {
      const docket = data[0];

      if (docket.errors || !docket.docket_info) {
        return secureJsonResponse({
          success: false,
          trackingNo: query,
          status: 'Not Found',
          events: [],
          error: sanitizeString(docket.tracking_no || 'AWB number not found in OM International system.', 128),
        });
      }

      const info = docket.docket_info;
      const status = info[4] ? sanitizeString(String(info[4][1]), 64) : 'Unknown';
      const bookedDate = info[1] ? sanitizeString(String(info[1][1]), 64) : undefined;
      const consignee = info[2] ? sanitizeString(String(info[2][1]), 128) : undefined;
      const destination = info[3] ? sanitizeString(String(info[3][1]), 128) : undefined;
      const deliveredDate = info[5] ? sanitizeString(String(info[5][1]), 64) : undefined;

      // Extract events
      const events = Array.isArray(docket.docket_events)
        ? docket.docket_events.map((ev: { event_description?: string; event_at?: string; event_location?: string; event_remark?: string }) => ({
            event_description: sanitizeString(ev.event_description || 'Transit Update', 128),
            event_at: sanitizeString(ev.event_at || '', 64),
            event_location: sanitizeString(ev.event_location || 'Transit Hub', 128),
            event_remark: sanitizeString(ev.event_remark || '', 256),
          }))
        : [];

      return secureJsonResponse({
        success: true,
        trackingNo: sanitizeString(docket.tracking_no || query, 64),
        forwardingNo: docket.forwarding_no ? sanitizeString(String(docket.forwarding_no), 64) : undefined,
        referenceNo: docket.reference_no ? sanitizeString(String(docket.reference_no), 64) : undefined,
        status,
        bookedDate,
        consignee,
        destination,
        pieces: docket.pcs ? sanitizeString(String(docket.pcs), 32) : undefined,
        weight: docket.weight ? sanitizeString(String(docket.weight), 32) : undefined,
        deliveredDate,
        podImage: docket.pod_image ? sanitizeString(String(docket.pod_image), 256) : undefined,
        events,
        isDemo: false,
      });
    }

    return secureJsonResponse({
      success: false,
      trackingNo: query,
      status: 'Not Found',
      events: [],
      error: 'Consignment record not found. Please verify your tracking number.',
    });
  } catch (err: unknown) {
    // Log detailed error internally without exposing stack traces to the public
    console.error('[Tracking API Error]:', err instanceof Error ? err.message : 'Unknown error');
    return secureJsonResponse(
      {
        success: false,
        trackingNo: query,
        status: 'Error',
        events: [],
        error: 'Unable to communicate with tracking service. Please try again later.',
      },
      500
    );
  }
}

