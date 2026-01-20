
import React, { useState, useEffect, useCallback } from 'react';
import { useRpc } from './RpcContext';
import { ConnectionManager } from './ConnectionManager';
import { IconAlert, IconExternal, IconInternal, IconCamera } from './Icons';
import { WindowMap } from './types';
import { WindowDetail } from './WindowDetail';
import { DesktopDetail } from './DesktopDetail';
import { WindowThumbnail } from './WindowThumbnail';
import { AppControl } from './AppControl';

export const Dashboard = () => {
  const { rpc, rpcBaseUrl, rpcToken } = useRpc();

  // Navigation and Display State
  const [displayMode, setDisplayMode] = useState<'new-tab' | 'same-page'>(() => {
    return (localStorage.getItem('display_mode') as 'new-tab' | 'same-page') || 'same-page';
  });
  const [activeDetail, setActiveDetail] = useState<{ type: 'window', id: number, url: string } | { type: 'desktop' } | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    localStorage.setItem('display_mode', displayMode);
  }, [displayMode]);

  useEffect(() => {
    if (!activeDetail) {
      document.title = "ElectronMcp Dashboard";
    }
  }, [activeDetail]);

  // Dashboard Data State
  const [windows, setWindows] = useState<WindowMap>({});
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Create Window State
  const [newUrl, setNewUrl] = useState('https://www.google.com');
  const [newAccountIdx, setNewAccountIdx] = useState(0);
  const [isCreating, setIsCreating] = useState(false);

  const fetchWindows = useCallback(async () => {
    try {
      const data = await rpc<WindowMap>('getWindows');
      setWindows(data || {});
      setConnectionError(null);
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e));
      if (!error.message.includes("Connection failed") && !error.message.includes("Invalid Server Response")) {
        console.error(e);
      }
      setConnectionError(error.message || "Failed to connect");
    }
  }, [rpc]);

  useEffect(() => {
    setWindows({});
    setConnectionError(null);
    fetchWindows();
    const interval = setInterval(fetchWindows, 5000); 
    return () => clearInterval(interval);
  }, [fetchWindows]);

  const handleOpenWindow = async () => {
    if (newAccountIdx < 0) return;
    setIsCreating(true);
    try {
      await rpc('openWindow', {
        account_index: newAccountIdx,
        url: newUrl,
        options: {
          width: 1280,
          webPreferences: {
            webviewTag: true,
          }
        },
        others: {
          openDevtools: { mode: false }
        }
      });
      await fetchWindows();
      setRefreshCounter(prev => prev + 1);
    } catch (e) {
      alert('Failed to open window: ' + e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelectWindow = (id: number, url: string) => {
    if (displayMode === 'new-tab') {
      const detailUrl = `${window.location.origin}/render?win_id=${id}&url=${encodeURIComponent(url)}`;
      window.open(detailUrl, '_blank');
    } else {
      setActiveDetail({ type: 'window', id, url });
    }
  };

  const handleOpenDesktop = () => {
    if (displayMode === 'new-tab') {
      const detailUrl = `${window.location.origin}/render?desktop=1`;
      window.open(detailUrl, '_blank');
    } else {
      setActiveDetail({ type: 'desktop' });
    }
  };

  if (activeDetail) {
    if (activeDetail.type === 'desktop') {
      return <DesktopDetail onBack={() => setActiveDetail(null)} />;
    }
    return (
      <WindowDetail 
        windowId={activeDetail.id} 
        initialUrl={activeDetail.url} 
        onBack={() => setActiveDetail(null)} 
      />
    );
  }

  return (
    <div className="flex h-full flex-col bg-root overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <span className="font-black text-xl">E</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">ElectronMcp</h1>
              <span className="text-[10px] text-secondary uppercase tracking-widest font-bold opacity-60">Control Dashboard</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-border mx-2"></div>

          <div className="flex bg-root/50 rounded-lg p-1 border border-border">
            <button 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${displayMode === 'new-tab' ? 'bg-accent text-white shadow-md' : 'text-secondary hover:text-primary'}`}
              onClick={() => setDisplayMode('new-tab')}
            >
              <IconExternal />
              <span className="hidden sm:inline">New Tab</span>
            </button>
            <button 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${displayMode === 'same-page' ? 'bg-accent text-white shadow-md' : 'text-secondary hover:text-primary'}`}
              onClick={() => setDisplayMode('same-page')}
            >
              <IconInternal />
              <span className="hidden sm:inline">Portal</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
              className="btn btn-sm btn-secondary flex items-center gap-2"
              onClick={handleOpenDesktop}
           >
             <IconCamera />
             Desktop
           </button>
           <ConnectionManager />
        </div>
      </header>

      {connectionError && (
        <div className="bg-danger/10 border-b border-danger/20 text-danger p-2 text-xs flex items-center justify-center gap-2 shrink-0">
          <IconAlert />
          <span className="font-semibold">{connectionError}</span>
          <button className="underline hover:text-white ml-2" onClick={() => fetchWindows()}>Retry</button>
        </div>
      )}

      <div className="main-content flex-1 scroll-y p-6">
        {/* Control Row Integration */}
        <section className="mb-8 max-w-5xl mx-auto">
          <AppControl 
            url={newUrl}
            onUrlChange={setNewUrl}
            accountIdx={newAccountIdx}
            onAccountIdxChange={setNewAccountIdx}
            onOpen={handleOpenWindow}
            isCreating={isCreating}
          />
        </section>

        {/* Sessions Grid */}
        <section className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary">Active Instances</h2>
              </div>
          </div>
          
          {Object.keys(windows).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border/40 rounded-3xl bg-card/20 grayscale opacity-50">
              <div className="w-16 h-16 border border-border rounded-full flex items-center justify-center mb-6 text-secondary/30">
                 <IconExternal />
              </div>
              <h3 className="font-bold text-primary mb-1 text-sm">System Idle</h3>
              <p className="text-[10px] text-secondary text-center uppercase tracking-widest font-medium">Ready for input</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(windows).map(([accIdx, sites]) => (
                <div key={accIdx} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-lg text-accent font-mono font-black text-[10px] tracking-widest">
                      ACCOUNT {accIdx}
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-border/50 to-transparent"></div>
                  </div>
                  
                  <div className="window-thumbs-grid">
                    {Object.entries(sites).map(([url, info]) => (
                      <WindowThumbnail
                        key={info.id}
                        id={info.id}
                        url={url}
                        refreshKey={refreshCounter}
                        rpcBaseUrl={rpcBaseUrl}
                        rpcToken={rpcToken}
                        onClick={() => handleSelectWindow(info.id, url)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      
      <style>{`
        .window-thumbs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        @media (max-width: 640px) {
          .window-thumbs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
