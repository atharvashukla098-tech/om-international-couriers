import { verifyAdminToken, secureJsonResponse } from '@/lib/security';

/**
 * Protected Admin Route: /api/admin/system
 * Requires: Authorization: Bearer <ADMIN_SECRET_KEY>
 */
export async function GET(request: Request) {
  if (!verifyAdminToken(request)) {
    return secureJsonResponse(
      {
        success: false,
        error: 'Unauthorized. High-privilege admin credentials required.',
      },
      401
    );
  }

  // Returns secure system telemetry for authorized administrators
  return secureJsonResponse({
    success: true,
    status: 'Operational',
    environment: process.env.NODE_ENV || 'production',
    gateway: 'BOM-Runway-27L',
    timestamp: new Date().toISOString(),
    securityAudit: {
      rateLimiter: 'Active',
      corsPolicy: 'Restricted',
      xssSanitization: 'Active',
      csp: 'Strict',
    },
  });
}
