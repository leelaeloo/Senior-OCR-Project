/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  productionBrowserSourceMaps: false,
  compress: true,
  swcMinify: true,
};

export default nextConfig;
