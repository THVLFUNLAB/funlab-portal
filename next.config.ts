import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xpvnbgmauvtoguoowwnn.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      }
    ],
  },

  // [H-02] HTTP Security Headers — bảo vệ chống XSS, Clickjacking, MIME sniffing
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Chống Clickjacking — trang không thể nhúng trong iframe của trang khác
          { key: 'X-Frame-Options', value: 'DENY' },
          // Chống MIME sniffing — trình duyệt không tự đoán loại file
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Kiểm soát thông tin Referrer khi chuyển trang
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Tắt các API trình duyệt không cần thiết
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // HSTS — bắt buộc dùng HTTPS trong 1 năm
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        ],
      },
    ];
  },
};

export default nextConfig;
