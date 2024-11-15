/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: true,  // Enable Turbopack
    middleware: true,  // Enable middleware (if applicable in your Next.js version)
  },
  reactStrictMode: true,
  webpack(config) {
    // Disable caching in webpack
    config.cache = false;
    return config;
  },
};

export default nextConfig;
