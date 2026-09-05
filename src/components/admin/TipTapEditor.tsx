'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useCallback, useState, useRef } from 'react';
import katex from 'katex';
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Quote, Minus, Table as TableIcon,
  Undo, Redo, Highlighter, Pilcrow, ClipboardPaste, X, Check,
  AlertCircle
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

// ── Render công thức LaTeX $...$ trong HTML string ──────────────
function injectKatex(html: string): string {
  // Block $$...$$
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_m, f) => {
    try { return `<div class="katex-block">${katex.renderToString(f.trim(), { displayMode: true, throwOnError: false })}</div>`; }
    catch { return f; }
  });
  // Inline $...$
  html = html.replace(/\$([^$\n]+?)\$/g, (_m, f) => {
    try { return katex.renderToString(f.trim(), { displayMode: false, throwOnError: false }); }
    catch { return f; }
  });
  return html;
}

export default function TipTapEditor({ content, onChange, placeholder }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Underline,
      Placeholder.configure({ placeholder: placeholder || 'Bắt đầu viết hoặc paste từ Word vào đây...' }),
    ],
    content,
    editorProps: {
      attributes: { class: 'tiptap-content focus:outline-none min-h-[500px] px-8 py-6' },
    },
    onUpdate({ editor }) { onChange(editor.getHTML()); },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  // ── Modal State ───────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'clipboard' | 'manual'>('clipboard');
  const [manualText, setManualText] = useState('');
  const [status, setStatus] = useState<'idle' | 'converting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const pasteZoneRef = useRef<HTMLDivElement>(null);

  // ── Cách 1: Đọc HTML từ Clipboard API ────────────────────────
  const handleClipboardPaste = async () => {
    setStatus('converting');
    setErrorMsg('');
    try {
      // Thử đọc HTML từ clipboard (modern browsers)
      const items = await navigator.clipboard.read();
      let html = '';
      for (const item of items) {
        if (item.types.includes('text/html')) {
          const blob = await item.getType('text/html');
          html = await blob.text();
          break;
        }
      }
      if (!html) throw new Error('no-html');

      // Dọn HTML của Gemini: bỏ script, style riêng, giữ nội dung
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      // Lấy body content
      let bodyHtml = doc.body.innerHTML;
      // Inject KaTeX cho $...$
      bodyHtml = injectKatex(bodyHtml);

      editor?.commands.setContent(bodyHtml);
      onChange(editor?.getHTML() || '');
      setStatus('success');
      setTimeout(() => { setShowModal(false); setStatus('idle'); }, 800);

    } catch (e: any) {
      if (e?.message === 'no-html' || e?.name === 'NotAllowedError') {
        setErrorMsg(e?.name === 'NotAllowedError'
          ? 'Trình duyệt chặn quyền đọc clipboard. Hãy dùng Cách 2 bên dưới.'
          : 'Clipboard không có HTML. Hãy dùng Cách 2 bên dưới.');
      } else {
        setErrorMsg('Lỗi: ' + (e?.message || 'unknown'));
      }
      setMode('manual');
      setStatus('error');
    }
  };

  // ── Cách 2: Paste vào vùng contenteditable ───────────────────
  // Browser tự convert clipboard HTML → nội dung
  const handlePasteZone = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html && html.trim()) {
      let processed = html;
      processed = injectKatex(processed);
      editor?.commands.setContent(processed);
    } else if (text) {
      // Fallback: plain text với basic markdown
      import('marked').then(({ marked }) => {
        marked.setOptions({ gfm: true } as any);
        const htmlFromMd = marked.parse(text) as string;
        const withMath = injectKatex(htmlFromMd);
        editor?.commands.setContent(withMath);
      });
    }
    onChange(editor?.getHTML() || '');
    setStatus('success');
    setTimeout(() => { setShowModal(false); setStatus('idle'); }, 600);
  };

  if (!editor) return <div className="animate-pulse bg-slate-800 rounded-2xl h-96" />;

  const btn = (active: boolean) =>
    `p-2 rounded-lg transition-all text-sm ${active
      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
      : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'}`;

  return (
    <>
      <div className="border border-slate-700/60 rounded-2xl overflow-hidden bg-slate-900/60">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-1 px-4 py-3 border-b border-slate-700/60 bg-slate-800/60 backdrop-blur-sm sticky top-0 z-10">
          <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btn(false)} title="Hoàn tác"><Undo className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btn(false)} title="Làm lại"><Redo className="w-4 h-4" /></button>
          <div className="w-px h-5 bg-slate-700 mx-1" />
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))} title="Tiêu đề 1"><Heading1 className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="Tiêu đề 2"><Heading2 className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="Tiêu đề 3"><Heading3 className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().setParagraph().run()} className={btn(editor.isActive('paragraph'))} title="Đoạn văn"><Pilcrow className="w-4 h-4" /></button>
          <div className="w-px h-5 bg-slate-700 mx-1" />
          <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="In đậm"><Bold className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="In nghiêng"><Italic className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))} title="Gạch chân"><UnderlineIcon className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))} title="Gạch ngang"><Strikethrough className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} className={btn(editor.isActive('highlight'))} title="Tô sáng"><Highlighter className="w-4 h-4" /></button>
          <div className="w-px h-5 bg-slate-700 mx-1" />
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Danh sách bullet"><List className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Danh sách số"><ListOrdered className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))} title="Trích dẫn"><Quote className="w-4 h-4" /></button>
          <div className="w-px h-5 bg-slate-700 mx-1" />
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))} title="Căn trái"><AlignLeft className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))} title="Căn giữa"><AlignCenter className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn(editor.isActive({ textAlign: 'right' }))} title="Căn phải"><AlignRight className="w-4 h-4" /></button>
          <div className="w-px h-5 bg-slate-700 mx-1" />
          <button onClick={addTable} className={btn(false)} title="Chèn bảng"><TableIcon className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)} title="Kẻ ngang"><Minus className="w-4 h-4" /></button>
          {editor.isActive('table') && (
            <>
              <div className="w-px h-5 bg-slate-700 mx-1" />
              <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600">+ Cột</button>
              <button onClick={() => editor.chain().focus().addRowAfter().run()} className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600">+ Hàng</button>
              <button onClick={() => editor.chain().focus().deleteColumn().run()} className="text-xs px-2 py-1 rounded bg-red-900/60 text-red-400">- Cột</button>
              <button onClick={() => editor.chain().focus().deleteRow().run()} className="text-xs px-2 py-1 rounded bg-red-900/60 text-red-400">- Hàng</button>
            </>
          )}
          <div className="ml-auto">
            <button onClick={() => { setShowModal(true); setMode('clipboard'); setStatus('idle'); setErrorMsg(''); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-300 hover:bg-violet-600/40 text-xs font-bold transition-all">
              <ClipboardPaste className="w-3.5 h-3.5" />
              Dán từ Gemini
            </button>
          </div>
        </div>
        <EditorContent editor={editor} />
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-violet-500/30 rounded-2xl w-full max-w-xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ClipboardPaste className="w-5 h-5 text-violet-400" />
                Dán Nội Dung Từ Gemini
              </h3>
              <button onClick={() => { setShowModal(false); setStatus('idle'); }} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Cách 1: Clipboard API */}
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
                <p className="text-sm font-bold text-violet-300 mb-1">⚡ Cách 1 — Tự động (nhanh nhất)</p>
                <p className="text-xs text-slate-500 mb-3">
                  Copy từ Gemini (Ctrl+C) → Bấm nút bên dưới → Xong!
                </p>
                <button
                  onClick={handleClipboardPaste}
                  disabled={status === 'converting'}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                >
                  {status === 'converting' ? <span className="animate-spin text-lg">⟳</span> : <ClipboardPaste className="w-4 h-4" />}
                  {status === 'converting' ? 'Đang xử lý...' : status === 'success' ? '✅ Xong!' : '📋 Đọc từ Clipboard & Áp dụng'}
                </button>
                {errorMsg && (
                  <div className="mt-2 flex items-start gap-2 text-xs text-amber-400">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>

              {/* Cách 2: Paste Zone */}
              <div className="rounded-xl border border-slate-700 p-4">
                <p className="text-sm font-bold text-slate-300 mb-1">🖐 Cách 2 — Paste trực tiếp</p>
                <p className="text-xs text-slate-500 mb-3">
                  Click vào vùng bên dưới → Ctrl+V → Tự động áp dụng
                </p>
                <div
                  ref={pasteZoneRef}
                  contentEditable
                  onPaste={handlePasteZone}
                  suppressContentEditableWarning
                  className="min-h-[80px] rounded-xl bg-slate-950 border-2 border-dashed border-slate-700 focus:border-violet-500 p-4 text-slate-500 text-sm focus:outline-none focus:text-slate-300 transition-colors"
                  style={{ cursor: 'text' }}
                >
                  <span className="pointer-events-none select-none">
                    Click vào đây rồi bấm Ctrl+V...
                  </span>
                </div>
              </div>

              <button onClick={() => { setShowModal(false); setStatus('idle'); }}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-sm font-bold transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
