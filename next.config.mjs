/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Generate static export for Netlify
  output: 'export',
  trailingSlash: true,
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Ensure proper asset paths
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;

