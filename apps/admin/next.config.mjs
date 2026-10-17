import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname;
    return config;
  }
};
export default nextConfig;