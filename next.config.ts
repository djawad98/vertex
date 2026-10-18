import type { NextConfig } from 'next';

// Static export: `out/` deploys as-is to GitHub Pages at https://vertex-idea.ir (CNAME at the repo root).
// NEXT_PUBLIC_BASE_PATH only for previewing a build under a sub-path; production serves from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const config: NextConfig = { output: 'export', trailingSlash: true, basePath };

export default config;
