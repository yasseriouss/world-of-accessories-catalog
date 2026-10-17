import path from 'path';
import { fileURLToPath } from 'url';
import createNextIntlPlugin from 'next-intl/plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js']
  },
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname;
    return config;
  }
};

export default withNextIntl(nextConfig);