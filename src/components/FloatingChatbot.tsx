'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useChat } from '@ai-sdk/react';

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // @ts-ignore - Bỏ qua lỗi Type của hook versions
  const { messages, input, handleInputChange, handleSubmit, status, error } = useChat({
    api: '/api/chat',
    initialMessages: [
      { id: 'welcome', role: 'assistant', content: 'Xin chào Sĩ tử! Thầy có thể giúp gì cho con? 🎓' }
    ]
  } as any);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Observer ẩn chatbot khi có profile modal
  useEffect(() => {
    try {
      const observer = new MutationObserver(() => {
        const hasModal = document.querySelector('[class*="z-[10000]"]') !== null;
        setIsHidden(hasModal);
        if (hasModal) setIsOpen(false);
      });
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (isHidden) return null;

  return (
    <div className="fixed right-4 z-[9000]" style={{ bottom: 'max(1.5rem, calc(1rem + env(safe-area-inset-bottom)))' }}>
      
      {/* NÚT MỞ CHAT */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="p-1 rounded-full bg-cyan-500/20 hover:scale-110 transition-transform duration-300 backdrop-blur-md border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center w-[60px] h-[60px]"
      >
        <Image
          src="/images/chat_icon.png"
          alt="Trợ lý Funlab"
          width={60}
          height={60}
          className="rounded-full w-auto h-auto min-w-full"
          priority
        />
      </button>

      {/* KHUNG CHAT UI */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[calc(100vw-2rem)] max-w-[350px] h-[450px] sm:h-[500px] bg-slate-950 border border-cyan-500/30 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/20 flex justify-between items-center shrink-0">
            <span className="font-bold text-cyan-400 text-sm">Trợ lý Funlab</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages?.map((m: any, idx: number) => (
              <div key={m?.id || idx} className={`flex gap-2 ${m?.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m?.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-500/50 shrink-0 mt-0.5 flex items-center justify-center bg-slate-800">
                    <Image src="/images/chat_icon.png" alt="Bot" width={24} height={24} className="w-auto h-auto min-w-full" />
                  </div>
                )}
                <div className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m?.role === 'user' ? 'bg-cyan-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm'}`}>
                  {m?.content || '...'}
                </div>
              </div>
            ))}

            {/* Hiển thị lỗi tối giản */}
            {error && (
              <div className="p-2 text-center">
                <span className="text-red-400 text-[10px] bg-red-900/10 px-2 py-1 rounded">
                  Lỗi kết nối AI: {error?.message || 'Không xác định'}
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }} 
            className="p-4 border-t border-cyan-500/20 bg-slate-900/50 shrink-0"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={input || ''}
                onChange={handleInputChange}
                placeholder="Câu hỏi của Sĩ tử..."
                disabled={status === 'streaming'}
                style={{ color: 'white' }}
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-2.5 pl-4 pr-12 text-sm !text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={status === 'streaming' || !input?.trim()}
                className="absolute right-2 text-cyan-500 hover:text-cyan-400 w-8 h-8 flex items-center justify-center disabled:opacity-30"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 rotate-90">
                  <path d="M3.4 20.4l17.45-8.48a1 1 0 000-1.84L3.4 1.6a1 1 0 00-1.39 1.3l2.57 7.51a1 1 0 010 .6l-2.57 7.51a1 1 0 001.39 1.3z" />
                </svg>
              </button>
            </div>
          </form>

        </div>
      )}
    </div>
  );
}