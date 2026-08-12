import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow requests from LAN IP (phone/other devices on same WiFi)
  allowedDevOrigins: ["10.10.3.2", "localhost"],
};

export default nextConfig;
