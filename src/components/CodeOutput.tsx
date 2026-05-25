'use client';

import { useEffect, useRef, useState } from 'react';
import hljs from 'highlight.js';
import { SupportedLanguage, LANGUAGE_EXTENSIONS } from '@/types';
import toast from 'react-hot-toast';

interface CodeOutputProps {
  code: string;
  language: SupportedLanguage;
  isGenerating: boolean;
}

export default function CodeOutput({ code, language, isGenerating }: CodeOutputProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current && code) {
      // Remove previous highlighting
      codeRef.current.removeAttribute('data-highlighted');
      codeRef.current.textContent = code;
      
      // Apply syntax highlighting
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            <span className="loading-dot inline-block w-3 h-3 bg-[#007acc] rounded-full" />
            <span className="loading-dot inline-block w-3 h-3 bg-[#007acc] rounded-full" />
            <span className="loading-dot inline-block w-3 h-3 bg-[#007acc] rounded-full" />
          </div>
          <p className="text-[#8a8a8a]">Generating code...</p>
          <p className="text-sm text-[#6a6a6a] mt-1">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="text-center text-[#6a6a6a]">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <p className="text-lg">No code generated yet</p>
          <p className="text-sm mt-1">Enter a prompt and click "Generate Code"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-[#3e3e42]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#8a8a8a]">
            {LANGUAGE_EXTENSIONS[language] || language}
          </span>
          <span className="text-xs text-[#6a6a6a]">
            • {code.split('\n').length} lines
          </span>
        </div>
        
        <button
          onClick={copyToClipboard}
          className={`copy-btn flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
            copied ? 'text-[#4ec9b0]' : 'text-[#cccccc] hover:bg-[#3e3e42]'
          }`}
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code block */}
      <div className="code-output overflow-auto max-h-[calc(100vh-400px)]">
        <pre className="!bg-[#1e1e1e]">
          <code
            ref={codeRef}
            className={`language-${LANGUAGE_EXTENSIONS[language] || language}`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
