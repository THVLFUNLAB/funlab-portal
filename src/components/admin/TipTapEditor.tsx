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
import { useEffect, useCallback, useState } from 'react';
import { marked } from 'marked';
import katex from 'katex';
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Quote, Minus, Table as TableIcon,
  Undo, Redo, Highlighter, Pilcrow, ClipboardPaste, X, Check
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
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
      attributes: {
        class: 'tiptap-content focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
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

  // ═══════════════════════════════════════════════════════════════
  // preprocessMarkdown — xử lý markdown từ Gemini
  // Trả về [text đã xử lý, map placeholder→KaTeX HTML]
  // Math được thay bằng placeholder TRƯỚC khi marked.parse()
  // để marked không đụng vào KaTeX HTML
  // ═══════════════════════════════════════════════════════════════
  const preprocessMarkdown = (md: string): [string, Record<string, string>] => {
    let text = md;
    const mathMap: Record<string, string> = {};
    let mi = 0;

    // ── BƯỚC 1: Bảo vệ công thức LaTeX bằng placeholder ──────────
    // Block math $$...$$  (xử lý TRƯỚC inline để không xung đột)
    text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_m, f) => {
      const k = `\u00ABmath${mi++}\u00BB`;
      try {
        mathMap[k] = `<div class="katex-block">${katex.renderToString(f.trim(), { displayMode: true, throwOnError: false })}</div>`;
      } catch { mathMap[k] = f; }
      return k;
    });

    // Inline math $...$ (không chứa newline, không phải $$)
    text = text.replace(/\$([^$\n]+?)\$/g, (_m, f) => {
      const k = `\u00ABmath${mi++}\u00BB`;
      try {
        mathMap[k] = katex.renderToString(f.trim(), { displayMode: false, throwOnError: false });
      } catch { mathMap[k] = f; }
      return k;
    });

    // ── BƯỚC 2: Chuyển bảng ASCII box-drawing (┌─│├) → pipe table ─
    text = text.replace(/((?:^[┌├└│].*\n?)+)/gm, (block) => {
      const rows: string[][] = [];
      for (const line of block.split('\n')) {
        const t = line.trim();
        if (t.startsWith('│')) {
          const cells = t.split('│').map(c => c.trim()).filter(c => c);
          if (cells.length) rows.push(cells);
        }
      }
      if (!rows.length) return block;
      const maxCols = Math.max(...rows.map(r => r.length));
      const sep = Array(maxCols).fill('---').join(' | ');
      return [
        '| ' + rows[0].join(' | ') + ' |',
        '| ' + sep + ' |',
        ...rows.slice(1).map(r => '| ' + r.join(' | ') + ' |'),
      ].join('\n') + '\n';
    });

    // ── BƯỚC 3: Chuẩn hoá pipe tables ─────────────────────────────
    // 3a. Xoá duplicate separator rows (giữ chỉ cái đầu tiên)
    // 3b. Gộp dòng continuation vào ô đúng (trước ô cuối cùng)
    // 3c. Bỏ qua blank lines TRONG table (không reset inTable)
    const isSep = (s: string) =>
      /^\|[\s\-:|]+\|$/.test(s) && !s.replace(/[\|\-:\s]/g, '').length;
    const isRow = (s: string) =>
      s.startsWith('|') && s.endsWith('|') && (s.match(/\|/g) || []).length >= 2;

    const lines = text.split('\n');
    const result: string[] = [];
    let inTable = false;
    let seenSep = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const t = line.trim();

      if (isRow(t)) {
        inTable = true;
        result.push(line);
      } else if (isSep(t) && inTable) {
        if (!seenSep) {
          result.push(line); // giữ separator đầu tiên
          seenSep = true;
        }
        // bỏ qua các separator sau
      } else if (t === '') {
        // blank line — nhìn trước: nếu dòng kế tiếp vẫn là table row/continuation → ở lại trong table
        let nextMeaningful = '';
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[j].trim()) { nextMeaningful = lines[j].trim(); break; }
        }
        if (inTable && !nextMeaningful.startsWith('#') &&
            !nextMeaningful.startsWith('##') &&
            nextMeaningful !== '' &&
            !isRow(nextMeaningful) === false) {
          // Dòng kế là table row → bỏ qua blank line
        } else if (inTable && !isRow(nextMeaningful) && nextMeaningful !== '' &&
                   !nextMeaningful.startsWith('#')) {
          // Dòng kế là continuation → giữ inTable, bỏ blank line
        } else {
          inTable = false;
          seenSep = false;
          result.push(line);
        }
      } else if (inTable && !isRow(t) && t !== '') {
        // Continuation line → chèn vào TRƯỚC ô cuối cùng của dòng trước
        const lastIdx = result.length - 1;
        if (lastIdx >= 0 && isRow(result[lastIdx].trim())) {
          const lastLine = result[lastIdx];
          // Tìm | cuối và | trước đó (để chèn vào ô penultimate)
          const trailingPipe = lastLine.lastIndexOf('|');
          const beforeTrailing = lastLine.lastIndexOf('|', trailingPipe - 1);
          if (beforeTrailing >= 0) {
            result[lastIdx] =
              lastLine.slice(0, beforeTrailing) +
              '<br>' + t +
              lastLine.slice(beforeTrailing);
          } else {
            result[lastIdx] = lastLine.replace(/\|\s*$/, '') + '<br>' + t + ' |';
          }
        } else {
          inTable = false;
          seenSep = false;
          result.push(line);
        }
      } else {
        inTable = false;
        seenSep = false;
        result.push(line);
      }
    }

    return [result.join('\n'), mathMap];
  };

  // ── Markdown Paste Modal ──────────────────────────────────────
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const [markdownText, setMarkdownText] = useState('');
  const [converting, setConverting] = useState(false);

  const handleMarkdownConvert = async () => {
    if (!markdownText.trim() || !editor) return;
    setConverting(true);
    try {
      const [processed, mathMap] = preprocessMarkdown(markdownText);
      marked.setOptions({ gfm: true, breaks: false } as any);
      let html = await marked.parse(processed);
      // Khôi phục KaTeX HTML SAU khi marked đã xử lý xong
      for (const [k, v] of Object.entries(mathMap)) {
        html = html.split(k).join(v);
      }
      editor.commands.setContent(html);
      onChange(html);
      setShowMarkdownModal(false);
      setMarkdownText('');
    } catch {
      alert('Lỗi chuyển đổi Markdown');
    }
    setConverting(false);
  };

  if (!editor) return <div className="animate-pulse bg-slate-800 rounded-2xl h-96" />;

  const btn = (active: boolean) =>
    `p-2 rounded-lg transition-all text-sm ${active
      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
      : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
    }`;

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
              <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">+ Cột</button>
              <button onClick={() => editor.chain().focus().addRowAfter().run()} className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">+ Hàng</button>
              <button onClick={() => editor.chain().focus().deleteColumn().run()} className="text-xs px-2 py-1 rounded bg-red-900/60 text-red-400 hover:bg-red-900 transition-colors">- Cột</button>
              <button onClick={() => editor.chain().focus().deleteRow().run()} className="text-xs px-2 py-1 rounded bg-red-900/60 text-red-400 hover:bg-red-900 transition-colors">- Hàng</button>
            </>
          )}
          {/* ── Nút Dán Markdown từ Gemini/ChatGPT ── */}
          <div className="ml-auto">
            <button
              onClick={() => setShowMarkdownModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-300 hover:bg-violet-600/40 text-xs font-bold transition-all"
              title="Dán nội dung Markdown từ Gemini/ChatGPT"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              Dán Markdown
            </button>
          </div>
        </div>

        {/* ── Editor Area ── */}
        <EditorContent editor={editor} />
      </div>

      {/* ── Markdown Paste Modal ── */}
      {showMarkdownModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-violet-500/30 rounded-2xl w-full max-w-2xl shadow-2xl shadow-violet-500/10">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <ClipboardPaste className="w-5 h-5 text-violet-400" />
                  Dán Nội Dung Từ Gemini / ChatGPT
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Dùng nút copy <strong>⧉</strong> trong Gemini (không bôi đen) → Paste vào đây → Bấm Chuyển đổi
                </p>
              </div>
              <button onClick={() => { setShowMarkdownModal(false); setMarkdownText(''); }} className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <textarea
                autoFocus
                value={markdownText}
                onChange={e => setMarkdownText(e.target.value)}
                rows={14}
                className="w-full bg-slate-950 border border-slate-700 focus:border-violet-500 rounded-xl p-4 text-slate-300 font-mono text-sm resize-none focus:outline-none transition-colors"
                placeholder={`# KẾ HOẠCH TỔ CHỨC NGÀY HỘI STEM\n\n## I. MỤC ĐÍCH\n\n**1. Mục đích & Ý nghĩa:**\n- Chuyển hóa bài học lý thuyết...\n\n| STT | Tiêu chí | Nội dung | Điểm |\n|---|---|---|---|\n| 1 | Vận hành | - Bi hoàn thành... | 35 |`}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-600">{markdownText.length} ký tự</span>
                <span className="text-xs text-slate-600">Hỗ trợ: # Tiêu đề · **đậm** · $LaTeX$ · | bảng |</span>
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => { setShowMarkdownModal(false); setMarkdownText(''); }} className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors">
                Hủy
              </button>
              <button
                onClick={handleMarkdownConvert}
                disabled={!markdownText.trim() || converting}
                className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
              >
                {converting ? <span className="animate-spin text-lg">⟳</span> : <Check className="w-4 h-4" />}
                {converting ? 'Đang chuyển đổi...' : 'Chuyển đổi & Áp dụng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
