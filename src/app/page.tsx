'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CodeEditor from '@/components/CodeEditor';
import CodeOutput from '@/components/CodeOutput';
import HistorySidebar from '@/components/HistorySidebar';
import LanguageSelector from '@/components/LanguageSelector';
import { CodeHistory, SupportedLanguage, SUPPORTED_LANGUAGES } from '@/types';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('python');
  const [generatedCode, setGeneratedCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<CodeHistory[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'code' | 'explanation'>('code');

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('codeHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        console.error('Failed to parse history');
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('codeHistory', JSON.stringify(history));
  }, [history]);

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setGeneratedCode('');
    setExplanation('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate code');
      }

      setGeneratedCode(data.code);
      setExplanation(data.explanation);
      setActiveTab('code');

      // Add to history
      const newEntry: CodeHistory = {
        id: Date.now().toString(),
        prompt,
        language,
        code: data.code,
        explanation: data.explanation,
        timestamp: new Date(),
      };

      setHistory(prev => [newEntry, ...prev].slice(0, 50)); // Keep last 50
      toast.success('Code generated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadFromHistory = (item: CodeHistory) => {
    setPrompt(item.prompt);
    setLanguage(item.language as SupportedLanguage);
    setGeneratedCode(item.code);
    setExplanation(item.explanation);
    setActiveTab('code');
  };

  const clearHistory = () => {
    setHistory([]);
    toast.success('History cleared');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#2d2d2d',
            color: '#cccccc',
            border: '1px solid #3e3e42',
          },
        }}
      />

      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <HistorySidebar
          history={history}
          isOpen={sidebarOpen}
          onSelect={loadFromHistory}
          onClear={clearHistory}
          onDelete={deleteHistoryItem}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Input Section */}
          <div className="p-4 border-b border-[#3e3e42]">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#cccccc] mb-2">
                  What do you want to build?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A REST API with Express.js that handles user authentication with JWT tokens..."
                  className="code-editor w-full h-24 p-3 rounded-lg border border-[#3e3e42] bg-[#1e1e1e]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      generateCode();
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-3 md:min-w-[200px]">
                <LanguageSelector
                  value={language}
                  onChange={setLanguage}
                />
                <button
                  onClick={generateCode}
                  disabled={isGenerating || !prompt.trim()}
                  className="btn-generate px-6 py-3 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <span className="loading-dot inline-block w-2 h-2 bg-white rounded-full" />
                      <span className="loading-dot inline-block w-2 h-2 bg-white rounded-full" />
                      <span className="loading-dot inline-block w-2 h-2 bg-white rounded-full" />
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate Code
                    </>
                  )}
                </button>
                <p className="text-xs text-[#6a6a6a] text-center">
                  Ctrl+Enter to generate
                </p>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#3e3e42] bg-[#252526]">
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'code'
                    ? 'tab-active text-white'
                    : 'text-[#8a8a8a] hover:text-[#cccccc]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Generated Code
                </span>
              </button>
              <button
                onClick={() => setActiveTab('explanation')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'explanation'
                    ? 'tab-active text-white'
                    : 'text-[#8a8a8a] hover:text-[#cccccc]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Explanation
                </span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'code' ? (
                <CodeOutput
                  code={generatedCode}
                  language={language}
                  isGenerating={isGenerating}
                />
              ) : (
                <div className="p-6">
                  {explanation ? (
                    <div className="explanation-content text-[#cccccc] leading-relaxed">
                      {explanation.split('\n').map((line, i) => {
                        if (line.startsWith('### ')) {
                          return <h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.replace('### ', '')}</h3>;
                        } else if (line.startsWith('## ')) {
                          return <h2 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('## ', '')}</h2>;
                        } else if (line.startsWith('# ')) {
                          return <h1 key={i} className="text-2xl font-bold mt-8 mb-4">{line.replace('# ', '')}</h1>;
                        } else if (line.startsWith('- ')) {
                          return <li key={i} className="ml-4">{line.replace('- ', '')}</li>;
                        } else if (line.trim() === '') {
                          return <br key={i} />;
                        } else {
                          return <p key={i}>{line}</p>;
                        }
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-[#6a6a6a]">
                      <p>Generate code to see the explanation</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
