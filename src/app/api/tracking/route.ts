import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.trim();
  const searchType = searchParams.get('type') || 'tracking_no';

  if (!query) {
    return NextResponse.json(
      { success: false, error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  const normalized = query.toUpperCase();

  // Demo Fallback for test IDs when checking the UI
  if (
    normalized === 'OM-8921-IN' ||
    normalized === 'DEMO' ||
    normalized === 'TEST' ||
    normalized === 'BOM-LHR'
  ) {
    return NextResponse.json({
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

  // Official Live API Endpoint
  const officialApiUrl = `https://admin.omcourier.in/api/tracking_api/get_tracking_data?${encodeURIComponent(
    searchType
  )}=${encodeURIComponent(
    query
  )}&customer_code=superadmin&company=OM-INTERNATIONAL-COURIER-CARGO-SERVICES&api_company_id=13`;

  try {
    const apiRes = await fetch(officialApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!apiRes.ok) {
      return NextResponse.json({
        success: false,
        trackingNo: query,
        status: 'Unreachable',
        events: [],
        error: `Official API responded with status ${apiRes.status}`,
      });
    }

    const data = await apiRes.json();

    if (Array.isArray(data) && data.length > 0) {
      const docket = data[0];

      if (docket.errors || !docket.docket_info) {
        return NextResponse.json({
          success: false,
          trackingNo: query,
          status: 'Not Found',
          events: [],
          error: docket.tracking_no || 'AWB number not found in OM International system.',
        });
      }

      const info = docket.docket_info;
      const status = info[4] ? info[4][1] : 'Unknown';
      const bookedDate = info[1] ? info[1][1] : undefined;
      const consignee = info[2] ? info[2][1] : undefined;
      const destination = info[3] ? info[3][1] : undefined;
      const deliveredDate = info[5] ? info[5][1] : undefined;

      // Extract events
      const events = Array.isArray(docket.docket_events)
        ? docket.docket_events.map((ev: { event_description?: string; event_at?: string; event_location?: string; event_remark?: string }) => ({
            event_description: ev.event_description || 'Transit Update',
            event_at: ev.event_at || '',
            event_location: ev.event_location || 'Transit Hub',
            event_remark: ev.event_remark || '',
          }))
        : [];

      return NextResponse.json({
        success: true,
        trackingNo: docket.tracking_no || query,
        forwardingNo: docket.forwarding_no || docket.forwarding_no1 || undefined,
        referenceNo: docket.reference_no || undefined,
        status,
        bookedDate,
        consignee,
        destination,
        pieces: docket.pcs || undefined,
        weight: docket.weight || undefined,
        deliveredDate,
        podImage: docket.pod_image || undefined,
        events,
        isDemo: false,
      });
    }

    return NextResponse.json({
      success: false,
      trackingNo: query,
      status: 'Not Found',
      events: [],
      error: 'Consignment record not found. Please verify your tracking number.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Error communicating with tracking servers.';
    return NextResponse.json(
      {
        success: false,
        trackingNo: query,
        status: 'Error',
        events: [],
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
