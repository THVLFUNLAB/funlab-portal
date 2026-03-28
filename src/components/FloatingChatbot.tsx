'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false); // Ẩn khi Modal xuất hiện
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: 'Xin chào Sĩ tử! Thầy có thể giúp gì cho con?' }
  ]);
  const [input, setInput] = useState('');

  // [FIX 1b] Tự động ẩn khi MandatoryProfileModal xuất hiện
  // Dùng MutationObserver để detect khi có element z-[10000] xuất hiện trong DOM
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Kiểm tra xem có Modal nào đang mở không (dựa vào class hoặc selector)
      const hasModal = document.querySelector('[class*="z-[10000]"]') !== null;
      setIsHidden(hasModal);
      // Đóng chatbot nếu đang mở khi modal xuất hiện
      if (hasModal) setIsOpen(false);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    console.log("Đã gửi tin nhắn:", input);
  };

  // Ẩn hoàn toàn khi modal đang mở — không render gì
  if (isHidden) return null;

  return (
    // [FIX 1a] z-[9000] < MandatoryProfileModal z-[10000]
    // bottom dùng max() để tự động nhận biết safe-area-inset-bottom (iPhone X+)
    <div
      className="fixed right-4 z-[9000]"
      style={{ bottom: 'max(1.5rem, calc(1rem + env(safe-area-inset-bottom)))' }}
    >
      {/* Nút bấm nổi */}
      <button
        id="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở Trợ lý Funlab"
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

      {/* Khung Chat
          [FIX 1] w-[calc(100vw-2rem)] đảm bảo không tràn màn hình điện thoại nhỏ
          max-w-[350px] giữ kích thước tối đa trên Desktop */}
      {isOpen && (
        <div
          className="
            absolute bottom-20 right-0
            w-[calc(100vw-2rem)] max-w-[350px]
            h-[450px] sm:h-[500px]
            bg-slate-950 border border-cyan-500/30 rounded-2xl
            flex flex-col shadow-2xl overflow-hidden
            animate-in fade-in slide-in-from-bottom-4
          "
        >
          {/* Header */}
          <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/20 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400">
                <Image src="/chat_icon.png" alt="Icon" width={32} height={32} />
              </div>
              <span className="font-bold text-cyan-400 text-sm">Trợ lý Funlab</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800"
              aria-label="Đóng chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`
                    max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed
                    ${m.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'}
                  `}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input — [FIX 4] min-h-[44px] đảm bảo touch target an toàn */}
          <div className="p-4 border-t border-cyan-500/20 bg-slate-900/50 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi thầy Hậu về Funlab..."
                className="
                  w-full bg-slate-800 border border-slate-700 rounded-full
                  py-2.5 pl-4 pr-12 text-sm text-white
                  min-h-[44px]
                  focus:outline-none focus:border-cyan-500 transition-colors
                "
              />
              <button
                onClick={handleSend}
                className="absolute right-2 text-cyan-500 hover:text-cyan-400 transition-colors w-8 h-8 flex items-center justify-center"
                aria-label="Gửi"
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