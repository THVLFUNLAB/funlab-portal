'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle, Edit2, Trash2, Eye, EyeOff, ExternalLink,
  Save, X, ChevronLeft, FileText, Globe, Lock, Loader2,
  CheckCircle, AlertCircle, Copy, Check
} from 'lucide-react';
import {
  getAllDocuments, upsertDocument, deleteDocument, toggleDocumentPublish
} from '@/app/admin/document-actions';

// Load editor động để tránh SSR
const TipTapEditor = dynamic(() => import('./TipTapEditor'), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-slate-800 rounded-2xl h-96" />
});

const CATEGORIES = [
  { value: 'du-an', label: '🚀 Dự Án' },
  { value: 'the-le', label: '📋 Thể Lệ' },
  { value: 'ket-qua', label: '🏆 Kết Quả' },
  { value: 'huong-dan', label: '📖 Hướng Dẫn' },
  { value: 'thong-bao', label: '📢 Thông Báo' },
];

const EMOJIS = ['📄', '🚀', '🎢', '🏆', '🔬', '⚗️', '🧪', '🌟', '🎯', '📋', '📢', '🔭', '💡', '🧲', '⚡'];

interface Doc {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  cover_emoji: string;
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface DocManagerProps {
  initialDocs: Doc[];
}

type View = 'list' | 'editor';

const emptyDoc = {
  id: '', slug: '', title: '', subtitle: '',
  cover_emoji: '📄', category: 'du-an', content: '', is_published: false,
};

export default function DocumentManager({ initialDocs }: DocManagerProps) {
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [view, setView] = useState<View>('list');
  const [editing, setEditing] = useState({ ...emptyDoc });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState('');

  const refreshDocs = useCallback(async () => {
    const { documents } = await getAllDocuments();
    setDocs(documents as Doc[]);
  }, []);

  const openNew = () => {
    setEditing({ ...emptyDoc });
    setView('editor');
  };

  const openEdit = async (doc: Doc) => {
    // Load full content
    const res = await fetch(`/api/documents/${doc.slug}`);
    const data = await res.json();
    setEditing({
      id: doc.id,
      slug: doc.slug,
      title: doc.title,
      subtitle: doc.subtitle || '',
      cover_emoji: doc.cover_emoji,
      category: doc.category,
      content: data.content || '',
      is_published: doc.is_published,
    });
    setView('editor');
  };

  const handleSave = async (publish?: boolean) => {
    if (!editing.title.trim()) { setSaveMsg('⚠️ Vui lòng nhập tiêu đề'); return; }
    setSaving(true);
    setSaveMsg('');
    const result = await upsertDocument({
      ...editing,
      is_published: publish !== undefined ? publish : editing.is_published,
    });
    if (result.error) {
      setSaveMsg('❌ ' + result.error);
    } else {
      setSaveMsg('✅ Đã lưu!');
      setEditing(prev => ({ ...prev, id: result.id || prev.id, slug: result.slug || prev.slug }));
      await refreshDocs();
      setTimeout(() => setSaveMsg(''), 3000);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xoá tài liệu "${title}"? Hành động này không thể hoàn tác.`)) return;
    setDeleting(id);
    await deleteDocument(id);
    await refreshDocs();
    setDeleting(null);
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await toggleDocumentPublish(id, current);
    await refreshDocs();
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`https://funlab-portal.vercel.app/du-an/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(''), 2000);
  };

  // ─── EDITOR VIEW ────────────────────────────────────────────
  if (view === 'editor') return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
          <ChevronLeft className="w-4 h-4" /> Về danh sách
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {saveMsg && (
            <span className={`text-sm font-bold ${saveMsg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
              {saveMsg}
            </span>
          )}
          {editing.slug && (
            <a href={`/du-an/${editing.slug}`} target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-sm transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Xem trang
            </a>
          )}
          <button onClick={() => handleSave(false)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-sm transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Lưu nháp
          </button>
          <button onClick={() => handleSave(true)} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
            Đăng công khai
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Emoji picker */}
        <div className="sm:col-span-2 flex items-center gap-3">
          <div className="text-4xl">{editing.cover_emoji}</div>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map(e => (
              <button key={e} onClick={() => setEditing(p => ({ ...p, cover_emoji: e }))}
                className={`text-xl p-1.5 rounded-lg transition-all ${editing.cover_emoji === e ? 'bg-cyan-500/20 ring-2 ring-cyan-500/50' : 'hover:bg-slate-700'}`}>
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="sm:col-span-2">
          <input
            type="text"
            value={editing.title}
            onChange={e => setEditing(p => ({ ...p, title: e.target.value }))}
            placeholder="Tiêu đề tài liệu *"
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-lg font-bold text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Subtitle */}
        <div className="sm:col-span-2">
          <input
            type="text"
            value={editing.subtitle}
            onChange={e => setEditing(p => ({ ...p, subtitle: e.target.value }))}
            placeholder="Mô tả ngắn (tuỳ chọn)"
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder:text-slate-600 outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Slug (URL)</label>
          <input
            type="text"
            value={editing.slug}
            onChange={e => setEditing(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))}
            placeholder="tu-dong-tao-tu-tieu-de"
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm font-mono text-cyan-400 placeholder:text-slate-600 outline-none focus:border-cyan-500/50"
          />
          {editing.slug && <p className="text-xs text-slate-600 mt-1">/du-an/{editing.slug}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Loại tài liệu</label>
          <select value={editing.category} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))}
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-cyan-500/50">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
      </div>

      {/* Editor */}
      <TipTapEditor
        content={editing.content}
        onChange={html => setEditing(p => ({ ...p, content: html }))}
        placeholder="Paste nội dung từ Word vào đây, hoặc bắt đầu viết..."
      />

      {/* Bottom save bar */}
      <div className="flex justify-end gap-3 mt-6">
        <button onClick={() => handleSave(false)} disabled={saving}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold transition-colors disabled:opacity-50">
          <Save className="w-4 h-4" /> Lưu nháp
        </button>
        <button onClick={() => handleSave(true)} disabled={saving}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white font-bold transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
          Đăng công khai
        </button>
      </div>
    </div>
  );

  // ─── LIST VIEW ───────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            📄 Tài Liệu
            <span className="text-sm font-normal text-slate-400">({docs.length} tài liệu)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Quản lý nội dung kế hoạch dự án, thể lệ, thông báo...</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white font-bold text-sm transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <PlusCircle className="w-4 h-4" /> Tạo tài liệu mới
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-slate-500 mb-6">Chưa có tài liệu nào. Tạo tài liệu đầu tiên!</p>
          <button onClick={openNew} className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors">
            Tạo ngay
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {docs.map((doc, i) => {
              const cat = CATEGORIES.find(c => c.value === doc.category);
              return (
                <motion.div key={doc.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all bg-slate-900/40
                    ${doc.is_published ? 'border-cyan-500/20' : 'border-slate-800'}`}>
                  {/* Emoji */}
                  <div className="text-3xl shrink-0">{doc.cover_emoji}</div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white truncate">{doc.title}</span>
                      {doc.is_published
                        ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/30">🌐 Công khai</span>
                        : <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-500 border border-slate-700">🔒 Nháp</span>
                      }
                      {cat && <span className="text-xs text-slate-500">{cat.label}</span>}
                    </div>
                    {doc.subtitle && <p className="text-xs text-slate-500 truncate mt-0.5">{doc.subtitle}</p>}
                    <p className="text-xs text-slate-600 mt-1 font-mono">/du-an/{doc.slug}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Copy link */}
                    <button onClick={() => copyLink(doc.slug)} title="Copy link"
                      className="p-2 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-slate-800 transition-all">
                      {copied === doc.slug ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* View */}
                    {doc.is_published && (
                      <a href={`/du-an/${doc.slug}`} target="_blank" title="Xem trang"
                        className="p-2 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-slate-800 transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {/* Toggle publish */}
                    <button onClick={() => handleTogglePublish(doc.id, doc.is_published)} title={doc.is_published ? 'Ẩn tài liệu' : 'Đăng công khai'}
                      className={`p-2 rounded-lg transition-all hover:bg-slate-800 ${doc.is_published ? 'text-green-400 hover:text-slate-400' : 'text-slate-500 hover:text-green-400'}`}>
                      {doc.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button onClick={() => openEdit(doc)} title="Chỉnh sửa"
                      className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button onClick={() => handleDelete(doc.id, doc.title)} disabled={deleting === doc.id} title="Xoá"
                      className="p-2 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-900/20 transition-all disabled:opacity-50">
                      {deleting === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
