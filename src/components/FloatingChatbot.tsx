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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom khi có tin mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

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
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Đọc streaming response từ Vercel AI SDK
      // Format: mỗi dòng là  0:"text chunk"\n  (AI SDK data protocol)
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No response body');

      let assistantContent = '';
      let buffer = '';

      // Thêm tin nhắn rỗng của bot để bắt đầu streaming vào đó
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Tách các dòng hoàn chỉnh từ buffer
        const lines = buffer.split('\n');
        // Dòng cuối có thể chưa hoàn chỉnh → giữ lại trong buffer
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          // AI SDK data protocol: dòng text có dạng  0:"..."
          if (line.startsWith('0:')) {
            try {
              // Parse chuỗi JSON để unescape ký tự đặc biệt
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
              // Bỏ qua dòng lỗi parse
            }
          }
        }
      }

      // Xử lý phần còn lại trong buffer (nếu có)
      if (buffer.startsWith('0:')) {
        try {
          const textChunk = JSON.parse(buffer.slice(2));
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
          // Bỏ qua
        }
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Xin lỗi sĩ tử, hệ thống đang bận. Vui lòng thử lại sau! 🙏',
        },
      ]);
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
        className="p-1 rounded-full bg-cyan-500/20 hover:scale-110 transition-transform duration-300 backdrop-blur-md border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
      >
        <Image
          src="/images/chat_icon.png"
          alt="Trợ lý Funlab"
          width={60}
          height={60}
          className="rounded-full"
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
              <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-400">
                <Image
                  src="/images/chat_icon.png"
                  alt="Trợ lý Funlab"
                  width={32}
                  height={32}
                />
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
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* Avatar bot */}
                {m.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-500/50 shrink-0 mt-0.5">
                    <Image
                      src="/images/chat_icon.png"
                      alt="Bot"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                <div
                  className={`
                    max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed
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

            {/* Loading / Typing indicator */}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-500/50 shrink-0 mt-0.5">
                  <Image
                    src="/images/chat_icon.png"
                    alt="Bot"
                    width={24}
                    height={24}
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

          {/* Input */}
          <div className="p-4 border-t border-cyan-500/20 bg-slate-900/50 shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
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
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 text-cyan-500 hover:text-cyan-400 transition-colors w-8 h-8 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
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