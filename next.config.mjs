/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: ''
      }
    ]
  },
  eslint: {
    // Skip ESLint during production builds
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
