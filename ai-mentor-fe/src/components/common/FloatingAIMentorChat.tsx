import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minus, Sparkles, Lightbulb, AlertTriangle, Cpu, RotateCcw } from 'lucide-react';
import { AIMessage, SocraticIntent } from '../../types/ai';
import { generateSocraticResponse } from '../../services/mockAIService';
import { MathMarkdownRenderer } from './MathMarkdownRenderer';
import gsap from 'gsap';

interface FloatingAIMentorChatProps {
  exerciseTitle?: string;
  category?: string;
  codeContext?: string;
  errorContext?: string;
  theme?: 'dark' | 'light';
}

export const FloatingAIMentorChat: React.FC<FloatingAIMentorChatProps> = ({
  exerciseTitle,
  category,
  codeContext,
  errorContext,
  theme,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (theme) return theme === 'dark';
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    if (theme) {
      setIsDarkMode(theme === 'dark');
    } else if (typeof document !== 'undefined') {
      const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
      checkDark();
      const observer = new MutationObserver(checkDark);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, [theme]);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>(() => [
    {
      id: 'init-1',
      role: 'assistant',
      content: exerciseTitle
        ? `👋 Xin chào! Mình là **AI Code Mentor** đang đồng hành cùng bạn ở bài tập **"${exerciseTitle}"**.
Bạn có thể hỏi bất kỳ câu hỏi nào về thuật toán, gợi ý các bước giải quyết hay phân tích lỗi nhé!`
        : `👋 Xin chào! Mình là **AI Code Mentor** khoa CNTT HNUE.
Bạn có thể hỏi mình bất kỳ câu hỏi nào về thuật toán (Dijkstra, Đồ thị, Quy hoạch động...), kiến thức lập trình (Python, C++, Java, SQL...), cách tối ưu mã nguồn hay chữa lỗi code!`,
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize initial message when exercise changes
  useEffect(() => {
    if (exerciseTitle) {
      setMessages([
        {
          id: `init-${Date.now()}`,
          role: 'assistant',
          content: `👋 Đang mở bài tập: **"${exerciseTitle}"** (${category || 'Lập trình'}).
Bạn có muốn mình gợi ý bước tư duy đầu tiên hoặc giải thích phương pháp giải tối ưu cho bài này không?`,
          timestamp: 'Vừa xong',
        },
      ]);
    }
  }, [exerciseTitle, category]);

  // GSAP Entrance animation when opening
  useEffect(() => {
    if (isOpen && windowRef.current) {
      gsap.fromTo(
        windowRef.current,
        { scale: 0.85, opacity: 0, y: 30, transformOrigin: 'bottom right' },
        { scale: 1, opacity: 1, y: 0, duration: 0.28, ease: 'back.out(1.2)' }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isGenerating, isOpen]);

  const handleSendMessage = async (textToSend?: string, explicitIntent?: SocraticIntent) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsGenerating(true);

    try {
      let intent: SocraticIntent = explicitIntent || 'free_chat';
      if (!explicitIntent) {
        const textLower = text.toLowerCase().trim();
        const isGreeting = /^(hi|hello|helo|hey|alo|chào|chao|xin chào|chào bạn|chào mentor|chào bot|good morning|hi bot|hello bot)[\s!.,?~]*$/i.test(textLower);
        if (isGreeting) {
          intent = 'greeting';
        } else if (textLower.includes('lỗi') || errorContext) {
          intent = 'explain_error';
        } else if (textLower.includes('độ phức tạp') || textLower.includes('big-o')) {
          intent = 'analyze_complexity';
        } else if (textLower.includes('bài này') || textLower.includes('gợi ý')) {
          intent = 'hint_next_step';
        } else {
          intent = 'free_chat';
        }
      }

      const aiResponse = await generateSocraticResponse(
        intent,
        text,
        codeContext || '',
        errorContext,
        {
          title: exerciseTitle,
          category,
          code: codeContext,
          error: errorContext,
        }
      );

      const botMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: 'Xin lỗi, hệ thống AI đang bận xử lý. Bạn hãy thử lại sau giây lát nhé!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        role: 'assistant',
        content: exerciseTitle
          ? `Đã làm mới cuộc trò chuyện cho bài **"${exerciseTitle}"**. Hãy cho mình biết bạn đang cần gợi ý ở bước nào nhé!`
          : 'Cuộc trò chuyện đã được làm mới. Hãy cho mình biết bạn đang có thắc mắc lập trình nào nhé!',
        timestamp: 'Vừa xong',
      },
    ]);
  };

  return (
    <aside aria-label="Trợ lý AI Code Mentor" className="fixed bottom-6 right-6 z-50 select-none">
      {/* 1. COLLAPSED: FLOATING ACTION BUTTON (ROUND BUBBLE) */}
      {!isOpen && (
        <div className="relative group flex items-center justify-end">
          {/* Tooltip pulsating */}
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer mr-3 px-3.5 py-1.5 rounded-full bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 text-xs font-bold shadow-xl flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95 animate-bounce border border-slate-700 dark:border-slate-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00EA64]" />
            <span>Hỏi AI Mentor</span>
          </div>

          {/* Glowing Green FAB */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Mở cửa sổ AI Code Mentor"
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#1BA94C] to-[#00EA64] text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-400/30"
          >
            <Bot className="w-7 h-7 text-white" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00EA64] ring-2 ring-white dark:ring-slate-900 animate-ping" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00EA64] ring-2 ring-white dark:ring-slate-900" />
          </button>
        </div>
      )}

      {/* 2. OPENED: COMPACT CHAT POPUP WINDOW (380x520) */}
      {isOpen && (
        <div
          ref={windowRef}
          className={`w-[380px] sm:w-[410px] h-[530px] max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-colors ${
            isDarkMode
              ? 'border-slate-700 bg-[#151f2e] text-slate-100'
              : 'border-slate-200 bg-white text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`h-14 px-4 border-b flex items-center justify-between flex-shrink-0 transition-colors ${
              isDarkMode
                ? 'bg-[#0c121d] border-slate-800 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#1BA94C] to-[#00EA64] text-white flex items-center justify-center shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold text-xs ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    AI Code Mentor
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#00EA64] animate-pulse" />
                </div>
                <span className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {exerciseTitle ? `Đang giải: ${exerciseTitle.slice(0, 24)}...` : 'Trợ lý lập trình đa năng • HNUE'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                title="Làm mới đoạn chat"
                className={`p-1.5 rounded-lg transition ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Thu nhỏ cửa sổ"
                className={`p-1.5 rounded-lg transition ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Đóng cửa sổ"
                className={`p-1.5 rounded-lg transition ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-3.5 text-xs ${isDarkMode ? 'bg-[#151f2e]' : 'bg-white'}`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 shadow-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1BA94C] text-white rounded-br-none'
                      : isDarkMode
                      ? 'bg-[#1a2332] text-slate-100 rounded-bl-none border border-slate-700'
                      : 'bg-slate-100 text-slate-900 font-medium rounded-bl-none border border-slate-200'
                  }`}
                >
                  <MathMarkdownRenderer
                    content={msg.content}
                    className={isDarkMode ? 'text-slate-100' : 'text-slate-900 font-medium'}
                  />
                </div>
                <span className={`text-[9px] mt-1 px-1 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isGenerating && (
              <div
                className={`flex items-center gap-2 p-2 rounded-lg text-[11px] font-medium border ${
                  isDarkMode
                    ? 'bg-emerald-950/30 text-[#00EA64] border-emerald-900/40'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#00EA64] animate-ping" />
                <span>AI đang phân tích câu hỏi và soạn câu trả lời...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips (Context-Aware vs General) */}
          <div
            className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none ${
              isDarkMode
                ? 'bg-[#0c121d] border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {exerciseTitle ? (
              // In-IDE Contextual Chips
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Gợi ý cho tôi các bước giải quyết bài này một cách tối ưu?', 'hint_next_step')}
                  className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 font-semibold ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-emerald-950 hover:text-[#00EA64]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100 hover:text-emerald-700'
                  }`}
                >
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  <span>Gợi ý bước tiếp theo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage('Giải thích giúp tôi lỗi compiler hoặc test case đang bị sai?', 'explain_error')}
                  className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 font-semibold ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-emerald-950 hover:text-[#00EA64]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100 hover:text-emerald-700'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-rose-500" />
                  <span>Giải thích lỗi</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage('Đánh giá độ phức tạp thời gian và không gian của thuật toán này?', 'analyze_complexity')}
                  className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 font-semibold ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-emerald-950 hover:text-[#00EA64]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100 hover:text-emerald-700'
                  }`}
                >
                  <Cpu className="w-3 h-3 text-cyan-500" />
                  <span>Độ phức tạp O(n)</span>
                </button>
              </>
            ) : (
              // Outside-IDE General Knowledge Chips
              <>
                <button
                  type="button"
                  onClick={() => handleSendMessage('Giải thích thuật toán Dijkstra và cho ví dụ minh họa?', 'free_chat')}
                  className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 font-semibold ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-emerald-950 hover:text-[#00EA64]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100 hover:text-emerald-700'
                  }`}
                >
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  <span>Thuật toán Dijkstra</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage('Cách tối ưu vòng lặp và chuyển từ O(n^2) về O(n)?', 'free_chat')}
                  className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 font-semibold ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-emerald-950 hover:text-[#00EA64]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100 hover:text-emerald-700'
                  }`}
                >
                  <Cpu className="w-3 h-3 text-emerald-500" />
                  <span>Tối ưu vòng lặp</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage('Giải thích 4 tính chất OOP trong Python có kèm code?', 'free_chat')}
                  className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 font-semibold ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-emerald-950 hover:text-[#00EA64]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100 hover:text-emerald-700'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span>Python OOP</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSendMessage('Phân biệt mẫu thiết kế Singleton và Factory?', 'free_chat')}
                  className={`px-2.5 py-1 rounded-full border transition flex items-center gap-1 font-semibold ${
                    isDarkMode
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-emerald-950 hover:text-[#00EA64]'
                      : 'bg-white text-slate-900 border-slate-300 hover:bg-slate-100 hover:text-emerald-700'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-indigo-500" />
                  <span>Design Patterns</span>
                </button>
              </>
            )}
          </div>

          {/* Footer Input Bar */}
          <div
            className={`p-3 border-t flex items-center gap-2 flex-shrink-0 ${
              isDarkMode
                ? 'bg-[#0c121d] border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                exerciseTitle
                  ? `Hỏi AI về bài "${exerciseTitle.slice(0, 18)}..."`
                  : 'Hỏi AI bất kỳ câu hỏi lập trình nào...'
              }
              disabled={isGenerating}
              className={`flex-1 h-10 px-3.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-[#00EA64]/40 focus:border-[#1BA94C] ${
                isDarkMode
                  ? 'bg-[#151f2e] border-slate-700 text-white placeholder:text-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-500'
              }`}
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim() || isGenerating}
              className="w-10 h-10 rounded-xl bg-[#1BA94C] hover:bg-[#15893d] text-white flex items-center justify-center transition active:scale-95 disabled:opacity-50 flex-shrink-0 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
