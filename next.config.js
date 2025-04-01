/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "pbs.twimg.com",
      "images.unsplash.com",
      "logos-world.net",
      "randomuser.me",
      "upload.wikimedia.org",
      "pps.whatsapp.net"
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
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js'],
    outputFileTracingIncludes: {
      '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto']
    }
  },
  swcMinify: true,
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
