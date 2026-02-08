import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "abcd.com",
      },
      {
        protocol: "https",
        hostname: "**.yourcdn.com",
      },
      {
        protocol: "https",
        hostname: "tutormeuploads.blob.core.windows.net",
      },
    ],
  },
};

export default nextConfig;
