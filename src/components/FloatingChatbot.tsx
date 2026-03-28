'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Xin chào Sĩ tử! Thầy có thể giúp gì cho con? 🎓' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorObj, setErrorObj] = useState<Error | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom khi có tin mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, errorObj]);

  // Ẩn chatbot khi MandatoryProfileModal xuất hiện
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const hasModal = document.querySelector('[class*="z-[10000]"]') !== null;
      setIsHidden(hasModal);
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

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setErrorObj(null); // Clear previous error
    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP error! status: ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body stream available.');

      let assistantContent = '';
      let buffer = '';

      // Thêm tin nhắn rỗng của bot để bắt đầu streaming vào đó
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('0:')) {
            try {
              const textChunk = JSON.parse(line.slice(2));
              assistantContent += textChunk;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                };
                return updated;
              });
            } catch {
              // Ignore partial parse error
            }
          }
        }
      }

      // Xử lý nốt buffer cuối
      if (buffer.startsWith('0:')) {
        try {
          const textChunk = JSON.parse(buffer.slice(2));
          assistantContent += textChunk;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
            return updated;
          });
        } catch {}
      }

    } catch (error: any) {
      console.error('Chatbot API error:', error);
      setErrorObj(error);
      // Fallback message so bubble doesn't stay empty
      setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content === '') {
          const updated = [...prev];
          updated.pop();
          return updated;
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isHidden) return null;

  return (
    <div
      className="fixed right-4 z-[9000]"
      style={{ bottom: 'max(1.5rem, calc(1rem + env(safe-area-inset-bottom)))' }}
    >
      {/* Nút bấm nổi */}
      <button
        id="chatbot-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở Trợ lý Funlab"
        className="p-1 rounded-full bg-cyan-500/20 hover:scale-110 transition-transform duration-300 backdrop-blur-md border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center w-[60px] h-[60px]"
      >
        <Image
          src="/images/chat_icon.png"
          alt="Trợ lý Funlab"
          width={60}
          height={60}
          className="rounded-full !w-auto !h-auto min-w-full"
          priority
        />
      </button>

      {/* Khung Chat */}
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
              <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400 flex items-center justify-center shrink-0">
                <Image
                  src="/images/chat_icon.png"
                  alt="Trợ lý Funlab"
                  width={32}
                  height={32}
                  className="!w-auto !h-auto min-w-full"
                />
              </div>
              <span className="font-bold text-cyan-400 text-sm">Trợ lý Funlab</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-800 shrink-0"
              aria-label="Đóng chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((m, index) => (
              <div key={index} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* Avatar bot */}
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-500/50 shrink-0 mt-0.5 flex items-center justify-center">
                    <Image
                      src="/images/chat_icon.png"
                      alt="Bot"
                      width={24}
                      height={24}
                      className="!w-auto !h-auto min-w-full"
                    />
                  </div>
                )}
                <div
                  className={`
                    max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${m.role === 'user'
                      ? 'bg-cyan-600 text-white rounded-tr-sm'
                      : 'bg-slate-800 text-slate-200 rounded-tl-sm'
                    }
                  `}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {/* Error UI Toast Alert */}
            {errorObj && (
              <div className="flex justify-center my-4 animate-in fade-in zoom-in-95">
                <div className="bg-red-950/80 border border-red-500/50 text-rose-200 px-4 py-3 rounded-xl text-xs flex flex-col gap-1 max-w-[90%] shadow-lg">
                  <div className="flex items-center gap-2 font-bold text-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Lỗi Hệ Thống!</span>
                  </div>
                  <span className="opacity-90 leading-relaxed font-mono">
                    {errorObj.message || 'Không thể kết nối đến Máy chủ AI.'}
                  </span>
                </div>
              </div>
            )}

            {/* Loading / Typing indicator */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-500/50 shrink-0 mt-0.5 flex items-center justify-center">
                  <Image
                    src="/images/chat_icon.png"
                    alt="Bot"
                    width={24}
                    height={24}
                    className="!w-auto !h-auto min-w-full"
                  />
                </div>
                <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-cyan-500/20 bg-slate-900/50 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi thầy về Funlab..."
                disabled={isLoading}
                className="
                  w-full bg-slate-800 border border-slate-700 rounded-full
                  py-2.5 pl-4 pr-12 text-sm text-white
                  min-h-[44px]
                  focus:outline-none focus:border-cyan-500 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  placeholder:text-slate-500
                "
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-2 text-cyan-500 hover:text-cyan-400 transition-colors w-8 h-8 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Gửi"
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