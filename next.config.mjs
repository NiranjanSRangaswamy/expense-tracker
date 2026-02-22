/** @type {import('next').NextConfig} */
const nextConfig = {
        allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev'],
          eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
