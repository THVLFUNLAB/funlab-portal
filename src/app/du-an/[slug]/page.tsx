import { createAdminClient } from '@/utils/supabase/admin';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Printer, Share2 } from 'lucide-react';

// ─── Metadata động ───────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('documents')
    .select('title, subtitle, cover_emoji')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!data) return { title: 'Không tìm thấy' };
  return {
    title: `${data.cover_emoji} ${data.title}`,
    description: data.subtitle || `Tài liệu từ FUNLAB Challenge — VA Science Club`,
  };
}

// ─── Page ────────────────────────────────────────────────────
export default async function DocumentPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: doc, error } = await supabase
    .from('documents')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !doc) notFound();

  const CATEGORY_LABELS: Record<string, string> = {
    'du-an': '🚀 Dự Án',
    'the-le': '📋 Thể Lệ',
    'ket-qua': '🏆 Kết Quả',
    'huong-dan': '📖 Hướng Dẫn',
    'thong-bao': '📢 Thông Báo',
  };

  const formattedDate = new Date(doc.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* ── Background ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10 pb-24">

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Về trang chủ
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => typeof window !== 'undefined' && window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white text-xs font-bold transition-all hover:bg-slate-700"
              aria-label="In tài liệu"
            >
              <Printer className="w-3.5 h-3.5" /> In
            </button>
          </div>
        </div>

        {/* ── Header ── */}
        <header className="mb-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Trang chủ</Link>
            <span>/</span>
            <span>{CATEGORY_LABELS[doc.category] || doc.category}</span>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-[200px]">{doc.title}</span>
          </div>

          {/* Cover emoji */}
          <div className="text-6xl mb-6">{doc.cover_emoji}</div>

          {/* Category badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-4">
            <Tag className="w-3 h-3" />
            {CATEGORY_LABELS[doc.category] || doc.category}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
            {doc.title}
          </h1>

          {/* Subtitle */}
          {doc.subtitle && (
            <p className="text-lg text-slate-400 leading-relaxed mb-6">{doc.subtitle}</p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-4 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              VA Science Club · Trường Việt Anh 2
            </span>
          </div>
        </header>

        {/* ── Content ── */}
        <article
          className="document-content"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />

        {/* ── Footer ── */}
        <footer className="mt-16 pt-8 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              <span className="font-bold text-slate-400">FUNLAB Challenge</span> · VA Science Club<br />
              Trường TH-THCS-THPT Việt Anh 2
            </div>
            <Link href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-sm font-bold transition-all hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4" /> Về trang chủ
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
