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

  // ── 4. Self-Contained First Flight Global Demo Tracking Engine ──────────────
  // Generates realistic, high-fidelity multimodal tracking telemetry for showcase visitors
  const sampleDestinations = [
    'London Heathrow (LHR), United Kingdom',
    'Dubai World Central (DWC), UAE',
    'John F. Kennedy (JFK), New York, USA',
    'Singapore Changi (SIN), Singapore',
    'Frankfurt CargoCity (FRA), Germany',
  ];
  const destIndex = Math.abs(query.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)) % sampleDestinations.length;
  const destination = sampleDestinations[destIndex];

  return secureJsonResponse({
    success: true,
    trackingNo: query.toUpperCase(),
    forwardingNo: `FF-FWD-${Math.floor(10000000 + Math.random() * 90000000)}`,
    referenceNo: `REF-BOM-${new Date().getFullYear()}-DEMO`,
    status: 'In Transit',
    bookedDate: '2026-10-14 14:30:00',
    consignee: 'Apex Global Logistics Partners Ltd',
    destination,
    pieces: '3 Cartons',
    weight: '42.50 KG',
    podImage: '',
    isDemo: true,
    carrier: 'First Flight Global Express',
    events: [
      {
        event_description: 'Departed International Air Freight Transit',
        event_at: '2026-10-16 21:40:00',
        event_location: 'Dubai World Central (DWC)',
        event_remark: 'Connecting Carrier Flight FF-982'
      },
      {
        event_description: 'Customs Cleared & Export Manifest Generated',
        event_at: '2026-10-15 19:15:00',
        event_location: 'Mumbai Air Cargo Complex (BOM)',
        event_remark: 'EDI Clearance Acknowledged'
      },
      {
        event_description: 'Consignment Weighed & X-Ray Scanned',
        event_at: '2026-10-15 11:20:00',
        event_location: 'First Flight Central Sorting Hub, Mumbai',
        event_remark: 'Security tamper-seal verified'
      },
      {
        event_description: 'Shipment Picked Up from Consignor',
        event_at: '2026-10-14 16:00:00',
        event_location: 'Sahar Cargo Terminal, Mumbai HQ',
        event_remark: 'Initial booking accepted'
      }
    ]
  });
}


