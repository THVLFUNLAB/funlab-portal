import Link from "next/link";
import { Home, Search } from "lucide-react";

export const metadata = {
  title: "404 — Không Tìm Thấy | Funlab",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative max-w-md w-full text-center space-y-8">
        {/* 404 glitch text */}
        <div>
          <p className="text-[120px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-[0_0_40px_rgba(34,211,238,0.5)] select-none">
            404
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto -mt-4 rounded-full" />
        </div>

        {/* Icon + message */}
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950/50 border border-cyan-500/30">
            <Search className="w-7 h-7 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Không tìm thấy trang này
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.<br />
            Hãy quay về trang chủ để tiếp tục hành trình khoa học nhé!
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-wide transition-all shadow-[0_8px_24px_rgba(6,182,212,0.3)] hover:shadow-[0_12px_32px_rgba(6,182,212,0.5)] hover:-translate-y-0.5"
        >
          <Home className="w-4 h-4" />
          Về Funlab Challenge
        </Link>

        {/* Footer hint */}
        <p className="text-xs text-slate-600 font-mono">
          VA SCIENCE CLUB · FUNLAB PORTAL
        </p>
      </div>
    </div>
  );
}
