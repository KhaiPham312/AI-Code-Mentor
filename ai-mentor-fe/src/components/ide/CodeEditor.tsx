import React, { useState, useMemo, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Code, Sun, Moon, ChevronDown } from 'lucide-react';
import {
  LanguageOption,
  getLanguageOptionsForContext,
  getInitialOptionForExercise,
} from '../../services/languageTracks';

export type { LanguageOption };

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  exerciseLanguage?: string;
  category?: string;
  trackIds?: string[];
  courseId?: string;
  selectedLanguageId?: string;
  onLanguageChange?: (newOption: LanguageOption) => void;
  onResetBoilerplate?: () => void;
  systemTheme?: 'dark' | 'light';
  onThemeToggle?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  exerciseLanguage = 'python',
  category,
  trackIds,
  courseId,
  selectedLanguageId,
  onLanguageChange,
  onResetBoilerplate,
  systemTheme = 'dark',
  onThemeToggle,
}) => {
  // Monaco Theme (vs-dark / vs-light) - synced with system theme by default
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs-light'>(() => {
    if (systemTheme) {
      return systemTheme === 'light' ? 'vs-light' : 'vs-dark';
    }
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light';
    }
    return 'vs-dark';
  });

  // Keep in sync whenever systemTheme prop changes
  useEffect(() => {
    if (systemTheme) {
      setEditorTheme(systemTheme === 'dark' ? 'vs-dark' : 'vs-light');
    }
  }, [systemTheme]);

  useEffect(() => {
    const updateTheme = () => {
      if (typeof document !== 'undefined') {
        const isDark = document.documentElement.classList.contains('dark');
        setEditorTheme(isDark ? 'vs-dark' : 'vs-light');
      }
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Language options matching HackerRank course standards
  const languageOptions = useMemo(
    () => getLanguageOptionsForContext(courseId, category, exerciseLanguage, trackIds),
    [courseId, category, exerciseLanguage, trackIds]
  );

  const initialOpt = useMemo(
    () => getInitialOptionForExercise(languageOptions, exerciseLanguage),
    [languageOptions, exerciseLanguage]
  );

  const [selectedLangOption, setSelectedLangOption] = useState<string>(
    selectedLanguageId || initialOpt.id
  );

  useEffect(() => {
    if (selectedLanguageId && languageOptions.some((o) => o.id === selectedLanguageId)) {
      setSelectedLangOption(selectedLanguageId);
    } else {
      setSelectedLangOption(initialOpt.id);
    }
  }, [selectedLanguageId, initialOpt, languageOptions]);

  const activeOption =
    languageOptions.find((opt) => opt.id === selectedLangOption) || initialOpt;

  const handleSelectLanguage = (optionId: string) => {
    setSelectedLangOption(optionId);
    const chosen = languageOptions.find((opt) => opt.id === optionId);
    if (chosen && onLanguageChange) {
      onLanguageChange(chosen);
    }
  };

  const isDark = editorTheme === 'vs-dark';

  return (
    <div
      className={`flex flex-col h-full border-b select-none transition-colors duration-150 ${
        isDark ? 'bg-[#1e1e1e] text-slate-200 border-slate-800' : 'bg-white text-slate-800 border-gray-300'
      }`}
    >
      {/* ================= EDITOR HEADER BAR (1:1 HACKERRANK) ================= */}
      <div
        className={`h-11 px-3 sm:px-4 border-b flex items-center justify-between text-xs ${
          isDark ? 'bg-[#181818] border-slate-800 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-700'
        }`}
      >
        {/* LEFT: EXACT ACTIVE FILE TAB (e.g. solution.py, solution.c) */}
        <div className="flex items-center space-x-2">
          <div
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-t-md font-mono text-xs font-semibold border-t-2 shadow-sm ${
              isDark
                ? 'bg-[#1e1e1e] text-emerald-400 border-t-[#00EA64]'
                : 'bg-white text-emerald-700 border-t-[#1BA94C]'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{activeOption.filename}</span>
          </div>
        </div>

        {/* RIGHT CONTROLS: Locked Language, Theme Toggle (vs-dark / vs-light), Icon-only Reset */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* HackerRank Language & Version Selector */}
          <div className="relative">
            <select
              value={activeOption.id}
              onChange={(e) => handleSelectLanguage(e.target.value)}
              aria-label="Chọn ngôn ngữ lập trình"
              className={`appearance-none text-xs rounded-lg px-2.5 py-1 pr-6 cursor-pointer font-semibold focus:outline-none border transition-colors ${
                isDark
                  ? 'bg-[#252526] text-emerald-400 border-slate-700 hover:border-emerald-500'
                  : 'bg-white text-emerald-700 border-gray-300 hover:border-emerald-600'
              }`}
            >
              {languageOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
          </div>

          {/* Theme Dropdown / Toggle (vs-dark / vs-light) */}
          <button
            type="button"
            onClick={() => {
              if (onThemeToggle) {
                onThemeToggle();
              } else if (typeof document !== 'undefined') {
                const currentlyDark = document.documentElement.classList.contains('dark');
                if (currentlyDark) {
                  document.documentElement.classList.remove('dark');
                  setEditorTheme('vs-light');
                } else {
                  document.documentElement.classList.add('dark');
                  setEditorTheme('vs-dark');
                }
              }
            }}
            title={isDark ? 'Chuyển sang Theme Sáng (vs-light)' : 'Chuyển sang Theme Tối (vs-dark)'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'text-amber-400 hover:text-amber-300 bg-slate-800/80 border-slate-700 hover:bg-slate-700'
                : 'text-slate-700 hover:text-slate-900 bg-gray-200/80 border-gray-300 hover:bg-gray-300'
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Icon-only Reset Boilerplate Button */}
          {onResetBoilerplate && (
            <button
              type="button"
              onClick={onResetBoilerplate}
              title="Khôi phục mã nguồn ban đầu (Reset)"
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'text-slate-400 hover:text-white bg-slate-800/80 border-slate-700 hover:bg-slate-700'
                  : 'text-gray-600 hover:text-gray-900 bg-gray-200/80 border-gray-300 hover:bg-gray-300'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ================= MONACO EDITOR INTEGRATION ================= */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <Editor
          height="100%"
          language={activeOption.monacoLang}
          theme={editorTheme}
          value={code}
          onChange={(val) => onChange(val || '')}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            tabSize: 4,
            automaticLayout: true,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            formatOnPaste: true,
            cursorBlinking: 'smooth',
            smoothScrolling: true,
          }}
          onMount={(editor) => {
            // Add Ctrl+Enter action to run code
            if (onRun) {
              editor.addCommand(
                // KeyMod.CtrlCmd | KeyCode.Enter
                2048 | 3,
                () => {
                  onRun();
                }
              );
            }
          }}
        />
      </div>

      {/* ================= STATUS BAR ================= */}
      <div
        className={`h-6 px-3 sm:px-4 border-t flex items-center justify-between text-[11px] font-mono select-none ${
          isDark ? 'bg-[#181818] border-slate-800 text-slate-500' : 'bg-gray-100 border-gray-200 text-gray-500'
        }`}
      >
        <div className="flex items-center space-x-3">
          <span>{activeOption.filename}</span>
          <span>•</span>
          <span>Monaco Editor VS Code</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{activeOption.label} • UTF-8</span>
        </div>
      </div>
    </div>
  );
};
