/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
        port: '',
        pathname: '/**', // Use a wildcard to allow paths from the domain
      },
    ],
  },
};

export default nextConfig;
