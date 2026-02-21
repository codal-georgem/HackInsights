import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow next-sanity image domains if you add images later
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
