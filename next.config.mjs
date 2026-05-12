/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /** Avoid broken vendor-chunks for framer-motion after interrupted builds / stale .next */
  transpilePackages: ["framer-motion"],
  experimental: {
    /** Client PDF export libs — keep server bundle predictable */
    serverComponentsExternalPackages: ["jspdf", "html2canvas"],
  },
};

export default nextConfig;
