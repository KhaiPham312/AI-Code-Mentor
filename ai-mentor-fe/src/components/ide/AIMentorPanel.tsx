import React, { useState, useRef, useEffect } from 'react';
import { AIMessage, QuickPrompt, SocraticIntent } from '../../types/ai';
import { QUICK_PROMPTS } from '../../services/mockAIService';
import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Cpu,
  ShieldCheck,
  RotateCcw,
  Loader2
} from 'lucide-react';
import { MathMarkdownRenderer } from '../common/MathMarkdownRenderer';

interface AIMentorPanelProps {
  messages: AIMessage[];
  isGenerating: boolean;
  onSendMessage: (content: string, intent?: SocraticIntent) => void;
  onQuickPrompt: (prompt: QuickPrompt) => void;
  onClearHistory: () => void;
  hasTerminalError?: boolean;
}

export const AIMentorPanel: React.FC<AIMentorPanelProps> = ({
  messages,
  isGenerating,
  onSendMessage,
  onQuickPrompt,
  onClearHistory,
  hasTerminalError
}) => {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSend = () => {
    if (!inputText.trim() || isGenerating) return;
    onSendMessage(inputText.trim(), 'free_chat');
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getPromptIcon = (iconName: string) => {
    switch (iconName) {
      case 'AlertTriangle':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'Lightbulb':
        return <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#13141f] border-l border-slate-800 text-slate-200">
      {/* Panel Header */}
      <div className="h-12 px-4 bg-[#0d0e17] border-b border-slate-800 flex items-center justify-between select-none">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs text-white">AI CODE MENTOR</span>
              <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700/60 rounded text-[9px] font-mono">
                Socratic
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-0.5">
              Định hướng tư duy • Không giải hộ
            </span>
          </div>
        </div>

        <button
          onClick={onClearHistory}
          title="Xóa lịch sử hội thoại"
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Socratic Pedagogical Notice */}
      <div className="px-3.5 py-2 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border-b border-slate-800/80 text-[11px] text-slate-300 flex items-center space-x-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="leading-tight">
          AI đặt câu hỏi gợi mở để bạn tự sửa lỗi, không đưa code hoàn chỉnh.
        </span>
      </div>

      {/* Chat Thread Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1 px-1 text-[10px] text-slate-400">
              {msg.role === 'assistant' ? (
                <>
                  <Bot className="w-3 h-3 text-indigo-400" />
                  <span className="font-semibold text-indigo-300">AI Mentor</span>
                </>
              ) : (
                <span className="font-semibold text-slate-300">Bạn</span>
              )}
              <span>•</span>
              <span className="font-mono">{msg.timestamp}</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                  : 'bg-slate-800/90 text-slate-200 rounded-tl-none border border-slate-700/80 shadow-sm'
              }`}
            >
              <div className="space-y-2">
                <MathMarkdownRenderer content={msg.content} />
              </div>
            </div>
          </div>
        ))}

        {isGenerating && !messages.some((m) => m.isStreaming && m.content) && (
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-1.5 mb-1 px-1 text-[10px] text-indigo-400">
              <Bot className="w-3 h-3 animate-bounce" />
              <span>AI Mentor đang suy nghĩ & định hướng...</span>
            </div>
            <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-800/90 border border-slate-700 text-slate-300 flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-xs">Đang phân tích cấu trúc mã nguồn...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Action Socratic Prompts */}
      <div className="p-3 bg-[#0d0e17] border-t border-slate-800 space-y-2">
        <div className="text-[11px] text-slate-400 font-medium px-1 flex items-center justify-between">
          <span>Gợi ý tương tác nhanh:</span>
          {hasTerminalError && (
            <span className="text-[10px] text-amber-400 font-semibold animate-pulse">
              ● Đang có lỗi ở Terminal
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp.id}
              disabled={isGenerating}
              onClick={() => onQuickPrompt(qp)}
              className={`p-2 rounded-lg text-left transition flex items-start space-x-2 text-[11px] border ${
                qp.id === 'explain_error' && hasTerminalError
                  ? 'bg-amber-950/50 border-amber-500/50 text-amber-200 hover:bg-amber-900/50'
                  : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-300'
              } disabled:opacity-50`}
            >
              <div className="mt-0.5">{getPromptIcon(qp.icon)}</div>
              <div className="flex-1 overflow-hidden">
                <div className="font-medium truncate">{qp.title}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="relative pt-1">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Hỏi AI Mentor về thuật toán, lỗi, tư duy... (Enter để gửi)"
            rows={2}
            disabled={isGenerating}
            className="w-full p-2.5 pr-10 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isGenerating}
            className="absolute right-2.5 bottom-3.5 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition shadow-sm"
          >
            {isGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
