/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable ESLint for production build
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Disable TypeScript checking for production build
    typescript: {
        ignoreBuildErrors: true,
    },

    // Enable experimental features
    experimental: {
        optimizePackageImports: ["lucide-react", "framer-motion"],
    },

    // Image optimization
    images: {
        formats: ["image/webp", "image/avif"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
    },

    // Compression
    compress: true,
};

module.exports = nextConfig;
