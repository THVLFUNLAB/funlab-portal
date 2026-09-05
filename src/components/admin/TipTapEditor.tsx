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
import { useEffect, useCallback } from 'react';
import {
  Bold, Italic, UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Quote, Minus, Table as TableIcon,
  Undo, Redo, Highlighter, Pilcrow
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

  // Sync nội dung từ ngoài vào (khi load lại document)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addTable = useCallback(() => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  if (!editor) return <div className="animate-pulse bg-slate-800 rounded-2xl h-96" />;

  const btn = (active: boolean) =>
    `p-2 rounded-lg transition-all text-sm ${active
      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
      : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200'
    }`;

  return (
    <div className="border border-slate-700/60 rounded-2xl overflow-hidden bg-slate-900/60">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1 px-4 py-3 border-b border-slate-700/60 bg-slate-800/60 backdrop-blur-sm sticky top-0 z-10">
        {/* Undo / Redo */}
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btn(false)} title="Hoàn tác">
          <Undo className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btn(false)} title="Làm lại">
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Headings */}
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))} title="Tiêu đề 1">
          <Heading1 className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))} title="Tiêu đề 2">
          <Heading2 className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))} title="Tiêu đề 3">
          <Heading3 className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().setParagraph().run()} className={btn(editor.isActive('paragraph'))} title="Đoạn văn">
          <Pilcrow className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Formatting */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))} title="In đậm">
          <Bold className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))} title="In nghiêng">
          <Italic className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))} title="Gạch chân">
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))} title="Gạch ngang">
          <Strikethrough className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()} className={btn(editor.isActive('highlight'))} title="Tô sáng">
          <Highlighter className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Lists */}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))} title="Danh sách bullet">
          <List className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))} title="Danh sách số">
          <ListOrdered className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))} title="Trích dẫn">
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Align */}
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))} title="Căn trái">
          <AlignLeft className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))} title="Căn giữa">
          <AlignCenter className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn(editor.isActive({ textAlign: 'right' }))} title="Căn phải">
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-700 mx-1" />

        {/* Table */}
        <button onClick={addTable} className={btn(false)} title="Chèn bảng">
          <TableIcon className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)} title="Kẻ ngang">
          <Minus className="w-4 h-4" />
        </button>

        {/* Table controls — chỉ hiện khi đang trong bảng */}
        {editor.isActive('table') && (
          <>
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">+ Cột</button>
            <button onClick={() => editor.chain().focus().addRowAfter().run()} className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors">+ Hàng</button>
            <button onClick={() => editor.chain().focus().deleteColumn().run()} className="text-xs px-2 py-1 rounded bg-red-900/60 text-red-400 hover:bg-red-900 transition-colors">- Cột</button>
            <button onClick={() => editor.chain().focus().deleteRow().run()} className="text-xs px-2 py-1 rounded bg-red-900/60 text-red-400 hover:bg-red-900 transition-colors">- Hàng</button>
          </>
        )}
      </div>

      {/* ── Editor Area ── */}
      <EditorContent editor={editor} />
    </div>
  );
}
