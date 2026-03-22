'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Xin chào Sĩ tử! Thầy có thể giúp gì cho con?' }
  ]);
  const [input, setInput] = useState(''); // Đây là biến để lưu chữ thầy gõ

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Gửi xong thì xóa ô nhập để gõ tiếp

    // Logic gọi AI sẽ nằm ở đây (Khi thầy đã cấu hình API Key)
    console.log("Đã gửi tin nhắn:", input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Nút bấm nổi - Dùng Icon PNG của Thầy Hậu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full bg-cyan-500/20 hover:scale-110 transition-transform duration-300 backdrop-blur-md border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
      >
        <Image
          src="/chat_icon.png"
          alt="Trợ lý Funlab"
          width={60}
          height={60}
          className="rounded-full"
        />
      </button>

      {/* Khung Chat */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] h-[500px] bg-slate-950 border border-cyan-500/30 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400">
                <Image src="/chat_icon.png" alt="Icon" width={32} height={32} />
              </div>
              <span className="font-bold text-cyan-400">Trợ lý Funlab</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>

          {/* Vùng hiển thị tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Ô nhập liệu - ĐÃ FIX LỖI "LIỆT PHÍM" */}
          <div className="p-4 border-t border-cyan-500/20 bg-slate-900/50">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input} // Gắn giá trị
                onChange={(e) => setInput(e.target.value)} // Gắn "lò xo" để gõ được chữ
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi thầy Hậu về Funlab..."
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={handleSend}
                className="absolute right-2 text-cyan-500 hover:text-cyan-400 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rotate-90">
                  <path d="M3.4 20.4l17.45-8.48a1 1 0 000-1.84L3.4 1.6a1 1 0 00-1.39 1.3l2.57 7.51a1 1 0 010 .6l-2.57 7.51a1 1 0 001.39 1.3z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}