import React, { useState, useRef, useEffect } from 'react';
import { AIMessage, QuickPrompt } from '../../types/ai';
import { QUICK_PROMPTS, INITIAL_AI_MESSAGES, generateSocraticResponse } from '../../services/mockAIService';
import { MathMarkdownRenderer } from '../common/MathMarkdownRenderer';
import { Language } from './dashboardI18n';
import {
  Bot,
  Send,
  X,
  Sparkles,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import gsap from 'gsap';

interface AIMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const AIMentorModal: React.FC<AIMentorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<AIMessage[]>(INITIAL_AI_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // GSAP animation
  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2, ease: 'power1.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.94, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.26, ease: 'power2.out' }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
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
      const response = await generateSocraticResponse('free_chat', text, '');
      const botMsg: AIMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: AIMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Xin lỗi bạn, đã có lỗi kết nối tới AI Mentor. Vui lòng thử lại sau ít giây.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickPromptClick = (p: QuickPrompt) => {
    handleSendMessage(p.title);
  };

  const renderPromptIcon = (iconName?: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      case 'Lightbulb':
        return <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-blue-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-3xl h-[86vh] max-h-[720px] rounded-2xl bg-white dark:bg-[#101726] border border-slate-200 dark:border-gray-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* HEADER */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#0c121d] border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-[#1BA94C] to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-900/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-sans">
                  {currentLang === 'vie' ? 'AI Socratic Mentor' : 'AI Socratic Mentor'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#1BA94C] text-white">
                  SOCRATIC
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {currentLang === 'vie'
                  ? 'Phương pháp gợi mở sư phạm • Tuyệt đối không spoil đáp án • Rèn luyện tư duy'
                  : 'Socratic dialogue • Zero solution spoilers • Algorithmic thinking companion'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMessages(INITIAL_AI_MESSAGES)}
              title={currentLang === 'vie' ? 'Làm mới đoạn chat' : 'Reset chat'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PEDAGOGICAL POLICY BANNER */}
        <div className="px-4 py-2 bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-blue-950/40 border-b border-emerald-900/30 text-[11px] text-emerald-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00EA64] flex-shrink-0" />
            <span>
              {currentLang === 'vie'
                ? 'AI Mentor sẽ đồng hành đặt câu hỏi để bạn tự tìm ra lỗi và viết code tối ưu.'
                : 'The Socratic mentor guides you through questions so you discover solutions independently.'}
            </span>
          </div>
          <span className="hidden sm:inline font-mono text-[10px] text-emerald-400/80">
            Rule: No-Direct-Code
          </span>
        </div>

        {/* CHAT MESSAGES BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                {msg.role === 'assistant' ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-bold text-emerald-600 dark:text-[#00EA64]">
                      AI Mentor
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-slate-600 dark:text-slate-300">Bạn (Sinh viên)</span>
                )}
                <span>•</span>
                <span className="font-mono">{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl max-w-[90%] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#1BA94C] text-white rounded-tr-none shadow-sm'
                    : 'bg-slate-100 dark:bg-[#151f33] text-slate-900 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-800 shadow-sm'
                }`}
              >
                <MathMarkdownRenderer content={msg.content} />
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                <Bot className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-bold text-emerald-500">AI Mentor</span>
                <span>•</span>
                <span className="font-mono">Đang suy nghĩ...</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#151f33] text-slate-900 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK PROMPT CHIPS */}
        <div className="px-4 py-2 bg-slate-50/70 dark:bg-[#0c121d]/70 border-t border-slate-200 dark:border-gray-800 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">
            {currentLang === 'vie' ? 'Gợi ý nhanh:' : 'Quick hints:'}
          </span>
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleQuickPromptClick(p)}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-[#00EA64] whitespace-nowrap transition-all shadow-sm disabled:opacity-50"
            >
              {renderPromptIcon(p.icon)}
              <span>{p.title}</span>
            </button>
          ))}
        </div>

        {/* INPUT BOX */}
        <div className="p-3.5 sm:p-4 bg-white dark:bg-[#101726] border-t border-slate-200 dark:border-gray-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                currentLang === 'vie'
                  ? 'Đặt câu hỏi về thuật toán, Big-O, hoặc paste thông báo lỗi...'
                  : 'Ask about algorithm strategy, Big-O complexity, or compiler errors...'
              }
              className="flex-1 h-11 px-4 text-xs rounded-xl bg-slate-50 dark:bg-[#0c121d] border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isGenerating}
              className="w-11 h-11 rounded-xl bg-[#1BA94C] hover:bg-[#15893d] text-white flex items-center justify-center shadow-md shadow-emerald-700/20 active:scale-95 transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
