
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 警告：這會讓你的網站忽略 ESLint 錯誤強制上線
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 警告：這會讓你的網站忽略 TypeScript 錯誤強制上線
    ignoreBuildErrors: true,
  },
};

export default nextConfig;