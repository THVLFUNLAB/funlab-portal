import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-16 h-16 rounded-full border-4 border-slate-800" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
        </div>
        <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">
          ĐANG TẢI...
        </p>
      </div>
    </div>
  );
}
