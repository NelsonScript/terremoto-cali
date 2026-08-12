import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deploy target: Firebase Hosting (estático) detrás de Cloudflare CDN.
  // Ver 03_architecture/ARQUITECTURA.md
  output: "export",
  trailingSlash: true,
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
