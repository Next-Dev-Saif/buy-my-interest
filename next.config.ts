import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.olx.com.pk",
      },
      {
        protocol: "https",
        hostname: "*.pakwheels.com",
      },
      {
        protocol: "https",
        hostname: "*.zameen.com",
      },
      {
        protocol: "https",
        hostname: "*.graana.com",
      },
      {
        protocol: "https",
        hostname: "*.daraz.pk",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
      },
      {
        protocol: "https",
        hostname: "platform.cstatic-images.com",
      },
      { protocol: "https", hostname: "bahriatownlistings.com" },
    ],
  },
};

export default nextConfig;
