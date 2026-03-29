export default function VomKhoaHocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30">
      {/* Background tĩnh hoặc gradient mờ phong cách vũ trụ */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black opacity-80 pointer-events-none"></div>
      
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
}
