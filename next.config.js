/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    domains: [
      // Auth providers
      "lh3.googleusercontent.com", // Google
      "pbs.twimg.com", // Twitter/X
      "avatars.githubusercontent.com", // GitHub
      
      // Storage and CDNs
      "chatbase-images.s3.eu-west-1.amazonaws.com", // AWS S3
      "chatbase-images.s3.amazonaws.com", // AWS S3 alternate
      
      // Demo/Sample content
      "images.unsplash.com",
      "logos-world.net",
      "randomuser.me",
      "upload.wikimedia.org",
      "pps.whatsapp.net",
      "files.onegiantleap.com",
      
      // Local development
      "localhost",
      "127.0.0.1",
      "webengage.com"
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Content-Type' },
        ],
      },
    ];
  },
  swcMinify: true,
  experimental: {
    // Remove invalid options
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    // ignoreBuildErrors: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // if (config.cache && !dev) {
    //   config.cache = Object.freeze({
    //     type: 'memory',
    //   })
    // }
    config.cache = false;
    // Important: return the modified config
    return config
  },
};

export default nextConfig;
