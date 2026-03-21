import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import { Settings } from "lucide-react";
import FloatingChatbot from "@/components/FloatingChatbot";
import "./globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Funlab",
  description: "Trang web của Thầy Hậu Vật lý đẹp trai",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has('admin_token');

  return (
    <html lang="en">
      <body className={`${notoSerif.variable} font-serif antialiased bg-slate-950 text-slate-50 relative`}>
        {children}
        
        {/* Lối Báo Động Quản Trị Viên */}
        <div className="fixed bottom-6 left-6 z-[9999] opacity-80 hover:opacity-100 transition-all duration-300 pointer-events-auto">
          <Link href={isAdmin ? "/admin/dashboard" : "/admin/login"} aria-label="Quản Trị Viên">
            <div className="p-3 bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 hover:bg-cyan-500/20 rounded-full transition-all group shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Settings className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.9)] transition-transform duration-500 group-hover:rotate-180 group-hover:scale-110" />
            </div>
          </Link>
        </div>

        {/* Trợ lý Funlab */}
        <FloatingChatbot />
      </body>
    </html>
  );
}