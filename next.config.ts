import path from "path";
import type { NextConfig } from "next";

// Security headers applied to every response. Conservative but real: prevents
// clickjacking, MIME sniffing, referrer leakage, and limits powerful APIs.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Parent folder also has package-lock.json; Turbopack would pick GitHub/ and fail to resolve tailwindcss.
  turbopack: {
    root: path.join(__dirname),
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // NOTE: We intentionally do NOT mirror server secrets into `env` here.
  // Anything placed in `next.config.ts > env` is inlined into the **client**
  // bundle and shipped to the browser. Server code reads `process.env.*`
  // directly at runtime; only `NEXT_PUBLIC_*` vars are meant for the client.
};

export default nextConfig;
