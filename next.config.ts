import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Parent folder also has package-lock.json; Turbopack would pick GitHub/ and fail to resolve tailwindcss.
  turbopack: {
    root: path.join(__dirname),
  },
  // NOTE: We intentionally do NOT mirror server secrets into `env` here.
  // Anything placed in `next.config.ts > env` is inlined into the **client**
  // bundle and shipped to the browser. Server code reads `process.env.*`
  // directly at runtime; only `NEXT_PUBLIC_*` vars are meant for the client.
};

export default nextConfig;
