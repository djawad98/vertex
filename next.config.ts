import type { NextConfig } from 'next';

// Static export: `out/` deploys as-is to Cloudflare Pages.
const config: NextConfig = { output: 'export', trailingSlash: true };

export default config;
