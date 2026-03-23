import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // skip strict mode
  output: "export",
  basePath: "/grotesk",
  assetPrefix: "/grotesk/",
  reactStrictMode: false,
  env: {
    googleAnalyticsId: process.env.NODE_ENV === "production" ? process.env.GA_MEASUREMENT_ID : "",
  }
};

export default nextConfig;
