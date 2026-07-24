import type { Metadata } from "next";
import { Noto_Serif, Inter } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import { Settings } from "lucide-react";
import MandatoryProfileModal from "@/components/MandatoryProfileModal";
import QuantumAudioRadar from "@/components/QuantumAudioRadar";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/lib/suppress-logs";
import "./globals.css";


// [FIX T-07] Thêm Inter làm font sans-serif thực sự cho body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

// [FIX P-01] SEO metadata đầy đủ — title, description, openGraph, twitter
export const metadata: Metadata = {
  metadataBase: new URL("https://funlab-portal.vercel.app"),
  title: {
    default: "Funlab Challenge | CLB Khoa Học Việt Anh 2",
    template: "%s | Funlab",
  },
  description:
    "Nền tảng học tập & thi đấu khoa học của VA Science Club — Trường TH-THCS-THPT Việt Anh 2. Chinh phục thử thách, leo bảng xếp hạng, nhận huy hiệu số.",
  keywords: ["funlab", "funlab challenge", "clb khoa học", "việt anh 2", "va science club", "vật lý", "hóa học"],
  authors: [{ name: "VA Science Club" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://funlab-portal.vercel.app",
    siteName: "Funlab Challenge",
    title: "Funlab Challenge | CLB Khoa Học Việt Anh 2",
    description: "Nền tảng học tập & thi đấu khoa học dành cho học sinh Trường Việt Anh 2.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Funlab Challenge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Funlab Challenge | CLB Khoa Học Việt Anh 2",
    description: "Nền tảng học tập & thi đấu khoa học dành cho học sinh Trường Việt Anh 2.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has("admin_token");

  return (
    // [FIX P-02] lang="vi" — website tiếng Việt phải khai báo đúng ngôn ngữ
    <html lang="vi">
      {/* [FIX T-07] font-sans → Inter (sans-serif thực sự), giữ notoSerif cho heading */}
      <body
        className={`${inter.variable} ${notoSerif.variable} font-sans antialiased bg-slate-950 text-slate-50 relative`}
      >
        {children}

        {/* Lối Báo Động Quản Trị Viên */}
        <div className="fixed bottom-6 left-6 z-[9999] opacity-80 hover:opacity-100 transition-all duration-300 pointer-events-auto">
          <Link href={isAdmin ? "/admin/dashboard" : "/admin/login"} aria-label="Vào trang Quản Trị Viên">
            <div className="p-3 bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 hover:bg-cyan-500/20 rounded-full transition-all group shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Settings className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] transition-transform duration-500 group-hover:rotate-180 group-hover:scale-110" />
            </div>
          </Link>
        </div>

        {/* Bắt buộc cập nhật thông tin */}
        <MandatoryProfileModal />

        {/* Radar âm thanh */}
        <QuantumAudioRadar />

        {/* [P3-01] Vercel Analytics — theo dõi traffic & hành vi người dùng */}
        <Analytics />
        {/* [P3-01] Speed Insights — đo Core Web Vitals (LCP, FCP, CLS) */}
        <SpeedInsights />
      </body>
    </html>
  );
}