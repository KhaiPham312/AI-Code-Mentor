import React, { useMemo } from 'react';
import katex from 'katex';

interface MathMarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Safely parse LaTeX math and Markdown formatting into React nodes.
 * High contrast on both Light Mode (deep black #111827) and Dark Mode (clean white/slate-200).
 */
export const MathMarkdownRenderer: React.FC<MathMarkdownRendererProps> = ({
  content,
  className = '',
}) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Helper: Render LaTeX math string via KaTeX
    const renderKatex = (latex: string, displayMode: boolean) => {
      try {
        return katex.renderToString(latex.trim(), {
          displayMode,
          throwOnError: false,
        });
      } catch {
        return latex;
      }
    };

    // Helper: Render inline formatted text (math, bold, code, italic)
    const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
      const tokenRegex = /(\$\$[^\$]+\$\$|\$[^\$]+\$|`[^`]+`|\*\*[^\*]+\*\*|\*[^\*]+\*)/g;
      const parts = text.split(tokenRegex);

      return parts.map((part, idx) => {
        const key = `${keyPrefix}-${idx}`;
        if (!part) return null;

        // Block math
        if (part.startsWith('$$') && part.endsWith('$$') && part.length >= 4) {
          const latex = part.slice(2, -2);
          const html = renderKatex(latex, true);
          return (
            <span
              key={key}
              className="block my-2.5 overflow-x-auto text-center text-neutral-900 dark:text-neutral-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        // Inline math
        if (part.startsWith('$') && part.endsWith('$') && part.length >= 2) {
          const latex = part.slice(1, -1);
          const html = renderKatex(latex, false);
          return (
            <span
              key={key}
              className="inline-block px-1 align-baseline text-neutral-900 dark:text-neutral-100"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        }

        // Inline code
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          const codeText = part.slice(1, -1);
          return (
            <code
              key={key}
              className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 font-mono text-xs border border-slate-300 dark:border-slate-700/60 font-semibold"
            >
              {codeText}
            </code>
          );
        }

        // Bold text (Deep Black in Light, Crisp White in Dark)
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          const boldText = part.slice(2, -2);
          return (
            <strong key={key} className="font-bold text-neutral-950 dark:text-white">
              {renderInline(boldText, `${key}-b`)}
            </strong>
          );
        }

        // Italic text
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
          const italicText = part.slice(1, -1);
          return (
            <em key={key} className="italic text-neutral-800 dark:text-slate-300">
              {renderInline(italicText, `${key}-i`)}
            </em>
          );
        }

        // Plain text
        return <span key={key}>{part}</span>;
      });
    };

    // Split content into blocks / paragraphs
    const lines = content.split('\n');
    const nodes: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockLang = '';
    let codeBlockLines: string[] = [];

    lines.forEach((line, lineIdx) => {
      // Code block start / end
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLang = line.trim().slice(3).trim();
          codeBlockLines = [];
        } else {
          inCodeBlock = false;
          nodes.push(
            <div
              key={`code-${lineIdx}`}
              className="my-3 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700/80 bg-slate-900 dark:bg-slate-950 font-mono text-xs shadow-sm"
            >
              {codeBlockLang && (
                <div className="px-3 py-1 bg-slate-800 dark:bg-slate-900 border-b border-slate-700 dark:border-slate-800 text-[11px] text-emerald-400 uppercase font-semibold">
                  {codeBlockLang}
                </div>
              )}
              <pre className="p-3 text-slate-100 dark:text-slate-200 overflow-x-auto leading-relaxed">
                <code>{codeBlockLines.join('\n')}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      const trimmed = line.trim();

      // Empty line -> spacing
      if (!trimmed) {
        nodes.push(<div key={`sp-${lineIdx}`} className="h-2" />);
        return;
      }

      // Headings
      if (trimmed.startsWith('### ')) {
        nodes.push(
          <h4
            key={`h3-${lineIdx}`}
            className="text-sm font-bold text-neutral-950 dark:text-white mt-3 mb-1 tracking-tight"
          >
            {renderInline(trimmed.slice(4), `h3-${lineIdx}`)}
          </h4>
        );
        return;
      }

      if (trimmed.startsWith('## ')) {
        nodes.push(
          <h3
            key={`h2-${lineIdx}`}
            className="text-base font-bold text-neutral-950 dark:text-white mt-4 mb-1.5 tracking-tight border-b border-slate-200 dark:border-slate-800 pb-1"
          >
            {renderInline(trimmed.slice(3), `h2-${lineIdx}`)}
          </h3>
        );
        return;
      }

      if (trimmed.startsWith('# ')) {
        nodes.push(
          <h2
            key={`h1-${lineIdx}`}
            className="text-lg font-extrabold text-neutral-950 dark:text-white mt-4 mb-2 tracking-tight"
          >
            {renderInline(trimmed.slice(2), `h1-${lineIdx}`)}
          </h2>
        );
        return;
      }

      // Blockquotes
      if (trimmed.startsWith('> ')) {
        nodes.push(
          <blockquote
            key={`bq-${lineIdx}`}
            className="pl-3 py-1.5 my-2 border-l-2 border-[#1BA94C] bg-emerald-50/80 dark:bg-emerald-950/20 text-neutral-800 dark:text-slate-300 italic text-xs rounded-r"
          >
            {renderInline(trimmed.slice(2), `bq-${lineIdx}`)}
          </blockquote>
        );
        return;
      }

      // Bullet list items
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        nodes.push(
          <div key={`li-${lineIdx}`} className="flex items-start gap-2 my-1 pl-2 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
            <span className="leading-relaxed text-slate-900 dark:text-slate-200 font-medium">
              {renderInline(trimmed.slice(2), `li-${lineIdx}`)}
            </span>
          </div>
        );
        return;
      }

      // Numbered list items
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        nodes.push(
          <div key={`num-${lineIdx}`} className="flex items-start gap-2 my-1 pl-2 text-xs">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold flex-shrink-0 min-w-[1.2rem]">
              {numMatch[1]}.
            </span>
            <span className="leading-relaxed text-slate-900 dark:text-slate-200 font-medium">
              {renderInline(numMatch[2], `num-${lineIdx}`)}
            </span>
          </div>
        );
        return;
      }

      // Normal paragraph (Deep black #0f172a in Light Mode, Slate in Dark Mode)
      nodes.push(
        <p key={`p-${lineIdx}`} className="leading-relaxed text-slate-900 dark:text-slate-200 text-xs sm:text-sm font-medium">
          {renderInline(line, `p-${lineIdx}`)}
        </p>
      );
    });

    return nodes;
  }, [content]);

  return <div className={`math-markdown-content ${className}`}>{renderedElements}</div>;
};
