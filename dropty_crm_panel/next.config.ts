import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Strict mode in development improves DX, safe in prod
  reactStrictMode: true,

  // Removes "X-Powered-By: Next.js"
  poweredByHeader: false,

  // NGINX handles compression (avoids double-gzip)
  compress: false,

  /**
   * If you load external images via next/image, specify here.
   * Example included - modify as needed.
   */
  images: {
    remotePatterns: [
      // Example:
      // { protocol: "https", hostname: "example.com" }
    ],
  },

  /**
   * Control new Next 15/16 logging behavior.
   */
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;