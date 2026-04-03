/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🌟 1. 允許你的手機 IP 連線測試！(解決 Blocked cross-origin 警告)
  allowedDevOrigins: ['192.168.100.101'], 
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 🌟 2. 把 eslint 的區塊整塊刪除 (解決 Unrecognized key 警告)
};

export default nextConfig;