'use client';

import { CodeHistory, SUPPORTED_LANGUAGES } from '@/types';

interface HistorySidebarProps {
  history: CodeHistory[];
  isOpen: boolean;
  onSelect: (item: CodeHistory) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function HistorySidebar({
  history,
  isOpen,
  onSelect,
  onClear,
  onDelete,
  onClose,
}: HistorySidebarProps) {
  const getLanguageIcon = (lang: string) => {
    const found = SUPPORTED_LANGUAGES.find(l => l.value === lang);
    return found?.icon || '📄';
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const truncatePrompt = (prompt: string, maxLength: number = 60) => {
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + '...';
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 bg-[#252526] border-r border-[#3e3e42]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:hidden'}
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-[#3e3e42]">
          <h2 className="text-sm font-semibold text-[#cccccc] flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
            {history.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-[#3e3e42] rounded-full">
                {history.length}
              </span>
            )}
          </h2>
          
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="p-1.5 hover:bg-[#3e3e42] rounded-md transition-colors text-[#8a8a8a] hover:text-[#cccccc]"
                title="Clear all history"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
            
            <button
              onClick={onClose}
              className="md:hidden p-1.5 hover:bg-[#3e3e42] rounded-md transition-colors text-[#8a8a8a]"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#6a6a6a] p-4">
              <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-sm text-center">No history yet</p>
              <p className="text-xs mt-1 text-center">Generated code will appear here</p>
            </div>
          ) : (
            <div className="py-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="history-item group relative px-4 py-3 cursor-pointer border-l-3 border-transparent hover:border-[#007acc]"
                  onClick={() => onSelect(item)}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">{getLanguageIcon(item.language)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#cccccc] truncate">
                        {truncatePrompt(item.prompt)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#8a8a8a] capitalize">
                          {item.language}
                        </span>
                        <span className="text-xs text-[#6a6a6a]">•</span>
                        <span className="text-xs text-[#6a6a6a]">
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#3e3e42] rounded transition-all text-[#8a8a8a] hover:text-[#f44747]"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-[#3e3e42]">
          <p className="text-xs text-[#6a6a6a] text-center">
            Click any item to load it
          </p>
        </div>
      </aside>
    </>
  );
}
