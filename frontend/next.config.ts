import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // next-pwa currently requires this to not throw Turbopack config errors
  // Next 15+ allows turbopack: {} to acknowledge webpack-only plugins
  turbopack: {}
};

export default withPWA(nextConfig);
