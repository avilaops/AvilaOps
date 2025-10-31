import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Allow cross-origin requests from local network during development
  allowedDevOrigins: [
    "http://192.168.0.103:3000",
    "http://localhost:3000",
  ],
};

export default nextConfig;
