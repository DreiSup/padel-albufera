import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withNextIntl = createNextIntlPlugin();

// `ANALYZE=true npm run build` abre el informe del bundle por ruta.
// Sirve para verificar que el peso de Three.js queda acotado a /configurador
// y no contamina el resto de rutas.
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.14"],
  images: {
    qualities: [70, 75],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
};

export default withAnalyzer(withNextIntl(nextConfig));
