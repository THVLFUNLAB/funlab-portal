"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Home, RefreshCw, AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log lỗi ra console chỉ khi dev, không lộ ra production user
    if (process.env.NODE_ENV !== "production") {
      console.error("[Funlab Error]", error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-950/50 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.25)]">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">
            Có lỗi xảy ra
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Hệ thống gặp sự cố không mong muốn. Thử làm mới trang hoặc quay về trang chủ.
          </p>
          {process.env.NODE_ENV !== "production" && error.message && (
            <p className="mt-3 text-xs font-mono text-red-400 bg-red-950/30 border border-red-800/50 rounded-lg p-3 text-left break-words">
              {error.message}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors border border-slate-700"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
