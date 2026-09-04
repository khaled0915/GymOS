import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is used for dev via `next dev --turbopack` script
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.21st.dev",
      },
    ],
  },
};

export default nextConfig;
