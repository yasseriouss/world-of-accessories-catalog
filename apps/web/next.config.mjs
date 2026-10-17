import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7
  },
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js']
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname;
    return config;
  }
};

export default withNextIntl(nextConfig);