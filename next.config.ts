import type { NextConfig } from 'next';
const config: NextConfig = { agentRules: false, trailingSlash: true, output: process.env.PREVIEW_STATIC_EXPORT === '1' ? 'export' : undefined, basePath: process.env.PREVIEW_BASE_PATH || '', allowedDevOrigins: ['127.0.0.1'] };
export default config;
