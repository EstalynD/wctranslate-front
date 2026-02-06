import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimización de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Configuración experimental
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Configuración de logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
