'use client';

import { useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CodeEditor({ value, onChange, placeholder }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Move cursor
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Enter your code here...'}
        className="code-editor w-full h-full min-h-[200px] p-4 rounded-lg border border-[#3e3e42] bg-[#1e1e1e]"
        spellCheck={false}
      />
      
      {/* Line numbers gutter effect */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] border-r border-[#3e3e42] pointer-events-none opacity-0" />
    </div>
  );
}
