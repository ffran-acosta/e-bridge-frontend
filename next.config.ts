import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuración para mejorar hot reload en Docker
  // Next.js 15 ya tiene mejor soporte, pero esto ayuda en algunos casos
  ...(process.env.NODE_ENV === 'development' && {
    // Forzar recarga en desarrollo
    experimental: {
      // Mejorar detección de cambios
    },
  }),
};

export default nextConfig;
