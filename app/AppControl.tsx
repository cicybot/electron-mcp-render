
import React from 'react';

interface AppControlProps {
  url: string;
  onUrlChange: (url: string) => void;
  accountIdx: number;
  onAccountIdxChange: (idx: number) => void;
  onOpen: () => void;
  isCreating: boolean;
}

export const AppControl: React.FC<AppControlProps> = ({
  url,
  onUrlChange,
  accountIdx,
  onAccountIdxChange,
  onOpen,
  isCreating
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isCreating) {
      onOpen();
    }
  };

  return (
    <div className="card h-16 px-4 flex items-center gap-4 shadow-lg border-white/5 bg-card/40 backdrop-blur-xl animate-in slide-in-from-top duration-500">
      {/* Label/Indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-secondary whitespace-nowrap">Control Panel</span>
      </div>

      <div className="h-6 w-[1px] bg-border/50 hidden md:block"></div>

      {/* URL Input Area */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-[10px] font-bold text-secondary/60 uppercase hidden lg:inline">Target</span>
        <input
          className="input flex-1 bg-root/40 py-1.5 px-3 font-mono text-sm border-white/5 focus:bg-root/80 transition-all truncate"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter automation URL..."
          spellCheck={false}
        />
      </div>

      {/* Account Picker */}
      <div className="flex items-center gap-2 shrink-0 px-2 bg-root/30 rounded-lg border border-white/5">
        <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Acc</span>
        <input
          type="number"
          min="0"
          className="w-12 bg-transparent py-1 text-sm font-bold text-center border-none outline-none text-accent"
          value={accountIdx}
          onChange={(e) => onAccountIdxChange(Math.max(0, parseInt(e.target.value) || 0))}
        />
      </div>

      {/* Action Button */}
      <button
        className="btn btn-primary h-10 px-6 text-xs font-black uppercase tracking-widest shadow-xl shadow-accent/20 disabled:opacity-50 shrink-0 group transition-all"
        onClick={onOpen}
        disabled={isCreating || !url}
      >
        {isCreating ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <span className="flex items-center gap-2">
            Launch
            <svg className="group-hover:translate-x-1 transition-transform" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        )}
      </button>
    </div>
  );
};
