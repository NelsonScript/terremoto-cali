import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deploy target: Firebase Hosting (estático) detrás de Cloudflare CDN.
  // Ver 03_architecture/ARQUITECTURA.md
  output: "export",
  trailingSlash: true,
  images: {
    // next/image con loader por defecto no funciona en export estático.
    // Se sirven imágenes optimizadas manualmente (WebP livianos) vía CDN de Cloudflare.
    unoptimized: true,
  },
};

export default nextConfig;
