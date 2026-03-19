import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif({ 
  subsets: ["latin", "vietnamese"], 
  variable: "--font-noto-serif",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "FUNLAB CHALLENGE",
  description: "Học Tập. Thi Đấu. Chinh Phục.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${notoSerif.variable} font-serif antialiased bg-slate-950 text-slate-50`}>
        {children}
      </body>
    </html>
  );
}
