/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Choose ONE of these options below, not both:
  
  // Option 1 (Recommended for most cases):
  transpilePackages: ['recharts'],
  
  // OR Option 2 (if you're using App Router and need server components):
  // experimental: {
  //   serverComponentsExternalPackages: ['recharts'],
  // }
};

export default nextConfig;