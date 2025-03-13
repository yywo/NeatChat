/** @type {import('next').NextConfig} */
const nextConfig = {
  // 保留您现有的配置...
  
  webpack: (config, { isServer }) => {
    // 忽略这些可选依赖
    config.externals = [...(config.externals || []), { 'bufferutil': 'bufferutil', 'utf-8-validate': 'utf-8-validate' }];
    return config;
  },
}

module.exports = nextConfig 