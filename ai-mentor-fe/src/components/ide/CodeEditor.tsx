import React, { useRef } from 'react';
import { RotateCcw, Copy, Check, Code } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  language?: string;
  onResetBoilerplate?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  language = 'python',
  onResetBoilerplate
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  // Tạo danh sách số dòng
  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 18);

  // Xử lý phím tắt: Tab (4 spaces) và Ctrl + Enter (Chạy code)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Chèn 4 dấu cách
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newCode);

      // Đặt lại con trỏ chuột
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  // Đồng bộ cuộn: số dòng cuộn theo textarea
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e2e] text-slate-200 border-b border-slate-800">
      {/* Editor Top Bar */}
      <div className="h-10 px-4 bg-[#181825] border-b border-slate-800 flex items-center justify-between text-xs select-none">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#252538] text-blue-400 rounded font-medium border border-blue-500/20">
            <Code className="w-3.5 h-3.5" />
            <span className="capitalize">{language} 3.11</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">
            solution.{language === 'python' ? 'py' : 'cpp'}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {onResetBoilerplate && (
            <button
              onClick={onResetBoilerplate}
              title="Khôi phục code ban đầu"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Khôi phục</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            title="Sao chép toàn bộ code"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition flex items-center gap-1"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">Đã chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Sao chép</span>
              </>
            )}
          </button>

          <div className="text-[11px] text-slate-400 px-2 py-0.5 bg-slate-800/80 rounded border border-slate-700/60 hidden lg:flex items-center gap-1">
            <kbd className="font-mono text-[10px] bg-slate-900 px-1 py-0.5 rounded text-slate-300">Ctrl</kbd> + <kbd className="font-mono text-[10px] bg-slate-900 px-1 py-0.5 rounded text-slate-300">Enter</kbd> để chạy
          </div>
        </div>
      </div>

      {/* Editor Body: Line numbers + Textarea */}
      <div className="relative flex-1 flex overflow-hidden font-mono text-[13px] leading-6 bg-[#181825]/90">
        {/* Line Numbers Gutter */}
        <div ref={gutterRef} className="w-12 py-3 bg-[#11111b] select-none text-right pr-3 text-slate-600 font-mono text-[12px] border-r border-slate-800/80 overflow-hidden">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="h-6 leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative flex-1 h-full">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            className="w-full h-full p-3 bg-transparent text-slate-100 font-mono text-[13px] leading-6 resize-none focus:outline-none selection:bg-blue-600/40 overflow-auto"
            style={{ tabSize: 4 }}
            placeholder="# Viết mã nguồn bài tập tại đây..."
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 px-4 bg-[#11111b] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 select-none">
        <div className="flex items-center space-x-4">
          <span>Dòng: {lines.length}</span>
          <span>Ký tự: {code.length}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Editor Ready (UTF-8)</span>
        </div>
      </div>
    </div>
  );
};
