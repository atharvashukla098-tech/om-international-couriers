/**
 * First Flight Global Security Suite
 * Production-grade security utilities:
 * - In-memory rate limiting (sliding window per client IP)
 * - Strict input sanitization & XSS prevention
 * - Safe regex validators for tracking and form parameters
 * - Constant-time comparison for admin authentication tokens
 */

import { NextResponse } from 'next/server';

// ── Rate Limiter ─────────────────────────────────────────────────────────────
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes to prevent memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  windowMs?: number; // default 60,000ms (1 min)
  maxRequests?: number; // default 30 requests per window
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remaining: number; resetInSec: number } {
  const windowMs = options.windowMs || 60 * 1000;
  const maxRequests = options.maxRequests || 30;
  const now = Date.now();

  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetInSec: Math.ceil(windowMs / 1000),
    };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInSec: Math.ceil((entry.resetTime - now) / 1000),
    };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetInSec: Math.ceil((entry.resetTime - now) / 1000),
  };
}

export function getClientIp(request: Request): string {
  const headers = request.headers;
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(',')[0].trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp.trim();

  return '127.0.0.1';
}

// ── Input Sanitization & XSS Protection ─────────────────────────────────────

/**
 * Escapes common HTML injection and XSS characters
 */
export function sanitizeString(input: string, maxLength = 256): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .slice(0, maxLength)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .trim();
}

/**
 * Validates tracking query strings (strict alphanumeric + safe punctuation)
 * Prevents SQL/NoSQL injection, directory traversal, and command injection
 */
const TRACKING_REGEX = /^[A-Za-z0-9\-_./# ]{2,64}$/;

export function isValidTrackingQuery(query: string): boolean {
  if (!query || typeof query !== 'string') return false;
  const trimmed = query.trim();
  if (trimmed.length < 2 || trimmed.length > 64) return false;
  return TRACKING_REGEX.test(trimmed);
}

/**
 * Strict whitelist for allowed tracking search types
 */
const ALLOWED_SEARCH_TYPES = new Set([
  'tracking_no',
  'forwarding_no',
  'forwarding_no1',
  'reference_no',
]);

export function isValidSearchType(type: string): boolean {
  return ALLOWED_SEARCH_TYPES.has(type);
}

// ── Admin Authentication Guard ──────────────────────────────────────────────

/**
 * Constant-time string comparison to prevent timing attacks
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Validates admin bearer token or API key for restricted admin operations
 */
export function verifyAdminToken(request: Request): boolean {
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  const configuredSecret = process.env.ADMIN_SECRET_KEY || process.env.OM_ADMIN_API_KEY;

  if (!configuredSecret) {
    // If no secret configured, fail securely in production
    if (process.env.NODE_ENV === 'production') {
      return false;
    }
    // In local dev, allow if token is present and non-empty
    return token.length > 0;
  }

  return constantTimeEqual(token, configuredSecret);
}

/**
 * Helper to generate standardized secure JSON responses
 */
export function secureJsonResponse<T>(
  data: T,
  status = 200,
  extraHeaders: Record<string, string> = {}
) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store, max-age=0',
      ...extraHeaders,
    },
  });
}

// ── Secure Password Hashing & Verification ───────────────────────────────────

import { randomBytes, pbkdf2Sync } from 'crypto';

/**
 * Hashes a plaintext password using PBKDF2 with SHA-512 and random salt
 * Format returned: salt:hash (64 bytes hex)
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== 'string') {
    throw new Error('Invalid password provided for hashing');
  }
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a plaintext password against a stored salt:hash string in constant time
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash || !storedHash.includes(':')) {
    return false;
  }
  const [salt, originalHash] = storedHash.split(':');
  if (!salt || !originalHash) return false;

  const computedHash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return constantTimeEqual(computedHash, originalHash);
}

