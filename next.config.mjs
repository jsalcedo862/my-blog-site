/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xynfwyfvldjaehvfrnvg.supabase.co",
      },
    ],
  },
};

export default nextConfig;
