/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  output: "standalone",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
