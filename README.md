# ✈️ OM International 3D — Next-Gen Spatial Logistics Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Security](https://img.shields.io/badge/Security-A%2B%20Hardened-10B981?style=for-the-badge&logo=shield)](https://github.com/atharvashukla098-tech/om-international-couriers)

A high-performance, 3D interactive logistics web application engineered for **OM International Courier & Cargo Services** (Mumbai, India). Features Apple-tier cinematic scrollytelling, dual-pipeline responsive canvas rendering, an interactive 3D globe network, live telemetry console, and a hardened production security layer.

---

## 🌟 Key Features

### 1. 🛩️ 300-Frame Cinematic Scrollytelling Takeoff
- **Synchronized Canvas Rendering:** 300 ultra-high-resolution WebP frames synced to viewport scroll via custom requestAnimationFrame (rAF) loops.
- **Dual Responsive Pipeline:**
  - **Desktop:** Edge-to-edge cover framing, multi-tier cockpit telemetry panels (`ALT`, `SPD`, `FROM`), and ambient scanlines.
  - **Mobile:** Portrait contain-ratio with zero wing cropping, compact thumb-accessible glass HUD, and 1:1 touch lerp tracking (factor 0.70–0.88).
- **Zero-Rerender DOM Mutations:** HUD telemetry updates direct to DOM refs, preventing React re-render cycles and maintaining locked 60 FPS on mobile.

### 2. 🌍 Interactive 3D Logistics Globe & Corridor Dispatch
- **Three.js & Mapbox GL JS Integration:** Dynamic spherical point-cloud globe displaying global air and maritime freight corridors originating from BOM (Mumbai).
- **Interactive Geocoding & Pin-Drop:** Search any city/hub globally or drop coordinates directly onto the sphere to calculate real-time haversine distance and multimodal transit times.

### 3. 📡 Real-Time Telemetry & Tracking Console
- **Direct Carrier Integration:** Connected to the live OM International tracking backend for instant AWB, forwarding number, and reference docket lookups.
- **Volumetric Weight Calculator:** Embedded IATA standard divisor (5000) calculator with dynamic cubic weight computation.

---

## 🛡️ Enterprise Security Architecture

The application has been audited and hardened according to OWASP Top 10 standards:

| Security Vector | Implementation | Status |
| :--- | :--- | :--- |
| **Rate Limiting** | Sliding-window IP rate limiter on edge API endpoints (30 req/min/IP with 429 response) | ✅ Active |
| **XSS & Injection Defense** | Server & client input sanitization, strict regex validation, character escaping | ✅ Active |
| **Security Headers** | Strict CSP, HSTS (`max-age=63072000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` | ✅ Enforced |
| **Information Disclosure** | `poweredByHeader: false` (X-Powered-By stripped), stack traces suppressed in API errors | ✅ Blocked |
| **Admin Route Guarding** | Next.js Edge Middleware protecting `/admin` and `/api/admin` with constant-time token verification | ✅ Active |
| **Credential & Secret Safety** | Complete Git history audit, `.env*` exclusion in `.gitignore`, no client-side private key leaks | ✅ Clean |
| **Cryptographic Hashing** | PBKDF2 (SHA-512, 100,000 iterations, 16-byte cryptographically secure salt) password utilities | ✅ Ready |
| **Dependency Auditing** | Updated to Next.js 16.4.2 to resolve upstream vulnerabilities (0 critical vulnerabilities) | ✅ Clean |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/atharvashukla098-tech/om-international-couriers.git
cd om-international-couriers

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local

# 4. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Create optimized production build
npm run build

# Start production server
npm run start
```

---

## 📦 Project Structure

```
om-courier-3d/
├── public/                  # Static assets & 300 WebP takeoff frames
│   ├── frames/              # Full-resolution desktop frames
│   ├── frames-mobile/       # Lightweight mobile-optimized frames
│   └── textures/            # High-res Earth sphere textures
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── about/           # Company heritage & 6 core pillars
│   │   ├── api/             # Secure REST endpoints (tracking, admin)
│   │   ├── dispatch/        # 3D interactive global dispatch corridor
│   │   └── page.tsx         # Main scrollytelling entrypoint
│   ├── components/          # Modular UI & 3D canvas components
│   │   ├── dispatch/        # SearchHUD, DestinationModal, GlobeEngine
│   │   ├── hero/            # Procedural Three.js ocean, cargo ships, aircraft
│   │   ├── hud/             # Glassmorphic tracking console & telemetry
│   │   └── scrollytelling/  # AirplaneHero, ArcCarousel, ProcessTracker3D
│   ├── lib/
│   │   ├── security.ts      # Rate limiter, sanitizers, token verifier, crypto
│   │   ├── tracking-api.ts  # Client-side tracking communications
│   │   └── geo-utils.ts     # Haversine & spherical coordinate mathematics
│   └── middleware.ts        # Edge security middleware & admin route guard
├── next.config.ts           # Hardened security headers, CSP, and CORS policy
└── package.json             # Locked dependencies & build scripts
```

---

## 🏢 Corporate Office

**OM International Courier & Cargo Services**  
51, Suraj Bhavan, Ground Floor, Karel Wadi, Thakurdwar,  
Mumbai - 400002, Maharashtra, India.  
- 📞 Phone: +91 9820729615 / 022 2386 0032  
- 💬 WhatsApp: +91 9869042220  
- ✉️ Email: cs.omcourierservices@gmail.com  

---

## 📄 License
Private Commercial Software — All Rights Reserved © 2026 OM International Courier & Cargo Services.
