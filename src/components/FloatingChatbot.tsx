"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, User } from "lucide-react";
import { useChat } from "@ai-sdk/react";

class ChatbotErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("FloatingChatbot Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Ẩn nội dung nếu có lỗi để không làm sập layout
      return null;
    }
    return this.props.children;
  }
}

function FloatingChatbotContent() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleInputChange, handleSubmit, isLoading } = useChat() as any;

  // Icon tồn tại tại /public/images/chat_icon.png
  const iconSrc = "/images/chat_icon.png";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {/* Khung Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-32px)] sm:w-[400px] h-[600px] max-h-[80vh] bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.25)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300 z-[99999] pointer-events-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-3 bg-slate-800/80 border-b border-cyan-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/50">
                 <Image src={iconSrc} alt="Bot Icon" width={32} height={32} className="object-cover" />
              </div>
              <h3 className="text-cyan-400 font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Trợ lý Funlab</h3>
            </div>
             <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Messages Container */}
          <div className="flex-1 w-full bg-slate-950 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 mt-10">
                <p>Xin chào Sĩ tử! Thầy có thể giúp gì cho con?</p>
              </div>
            )}
            {messages.map((m: any) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center overflow-hidden border ${m.role === 'user' ? 'bg-slate-800 border-slate-600' : 'bg-cyan-950 border-cyan-500/50'}`}>
                  {m.role === 'user' ? <User className="w-5 h-5 text-slate-300" /> : <Image src={iconSrc} alt="Bot Icon" width={32} height={32} className="object-cover" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-slate-700 text-white rounded-tr-none' : 'bg-cyan-950/50 border border-cyan-500/20 text-cyan-50 rounded-tl-none whitespace-pre-wrap'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
               <div className="flex gap-3 flex-row">
                 <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center overflow-hidden border bg-cyan-950 border-cyan-500/50">
                    <Image src={iconSrc} alt="Bot Icon" width={32} height={32} className="object-cover" />
                 </div>
                 <div className="max-w-[80%] rounded-2xl p-3 text-sm bg-cyan-950/50 border border-cyan-500/20 text-cyan-50 rounded-tl-none flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                   <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                   <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-3 bg-slate-800/80 border-t border-cyan-500/20 backdrop-blur-md">
            <div className="relative">
              <input
                value={input || ""}
                onChange={(e) => {
                  if (setInput) setInput(e.target.value);
                  else if (handleInputChange) handleInputChange(e);
                }}
                placeholder="Hỏi thầy Hậu về Funlab..."
                className="w-full bg-slate-900 border border-slate-700 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-500"
              />
              <button
                type="submit"
                disabled={isLoading || !(input || "").trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 rounded-full flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>

        </div>
      )}

      {/* Nút Nổi */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-[99999] pointer-events-auto">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full flex items-center justify-center p-0 overflow-hidden relative group border-2 border-cyan-400/50 hover:border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 hover:scale-105"
          aria-label="Mở trợ lý"
        >
          <div className="absolute inset-0 bg-cyan-500/20 group-hover:bg-cyan-400/30 transition-colors pointer-events-none" />
          <Image
            src={iconSrc}
            alt="Chat Icon"
            width={64}
            height={64}

            className="object-cover w-full h-full"
          />
        </button>
      </div>
    </>
  );
}

export default function FloatingChatbot() {
  return (
    <ChatbotErrorBoundary>
      <FloatingChatbotContent />
    </ChatbotErrorBoundary>
  );
}
