import type { NextConfig } from 'next';

const basePath = process.env.PREVIEW_BASE_PATH || '';

const config: NextConfig = {
  agentRules: false,
  trailingSlash: true,
  output: process.env.PREVIEW_STATIC_EXPORT === '1' ? 'export' : undefined,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  allowedDevOrigins: ['127.0.0.1'],
};

export default config;
