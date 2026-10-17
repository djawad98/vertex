import type { NextConfig } from 'next';

// Static export: `out/` deploys as-is to GitHub Pages.
// NEXT_PUBLIC_BASE_PATH is '/vertex' while the site lives at djawad98.github.io/vertex/,
// and empty once it moves to its own domain.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const config: NextConfig = { output: 'export', trailingSlash: true, basePath };

export default config;
