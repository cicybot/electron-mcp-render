
import React, { useState, useEffect, useRef } from 'react';
import { useRpc } from './RpcContext';
import { IconArrowLeft } from './Icons';
import View from './View';

export const WindowDetail = ({ windowId, initialUrl, onBack }: { windowId: number, initialUrl: string, onBack: () => void }) => {
    const { rpc, rpcBaseUrl, rpcToken } = useRpc();
    const [navUrl, setNavUrl] = useState(initialUrl);
    const [screenshotUrl, setScreenshotUrl] = useState<string>('');
    const [isAutoRefresh, setIsAutoRefresh] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        document.title = `Instance #${windowId}`;
        fetchScreenshot();
    }, []);

    const fetchScreenshot = async () => {
        try {
            const url = (rpcBaseUrl ? `${rpcBaseUrl}/windowScreenshot` : '/windowScreenshot') + `?id=${windowId}&t=${Date.now()}`;
            const headers: Record<string, string> = {};
            if (rpcToken) headers['Authorization'] = `Bearer ${rpcToken}`;
            
            const response = await fetch(url, { headers });
            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                const blob = new Blob([arrayBuffer], { type: 'image/png' });
                const blobUrl = URL.createObjectURL(blob);
                setScreenshotUrl(prev => {
                    if (prev) URL.revokeObjectURL(prev);
                    return blobUrl;
                });
            }
        } catch (error) {
            console.error('Failed to fetch screenshot:', error);
        }

        try {
            const bounds = await rpc<{ x: number; y: number; width: number; height: number }>('getBounds', { win_id: windowId });
            if (bounds) {
                const el = document.querySelector("#bound");
                if (el) el.textContent = `${bounds.width}x${bounds.height} @ (${bounds.x},${bounds.y})`;
            }
        } catch (e) {
            console.error('Failed to get bounds:', e);
        }
    };

    useEffect(() => {
        let timeoutId: any = null;
        const scheduleNextFetch = () => {
            if (isAutoRefresh) {
                timeoutId = setTimeout(() => fetchScreenshot().then(scheduleNextFetch), 1000);
            }
        };
        if (isAutoRefresh) scheduleNextFetch();
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
        };
    }, [rpcBaseUrl, rpcToken, isAutoRefresh]);

    const handleNavigate = async () => {
        await rpc('loadURL', { win_id: windowId, url: navUrl });
        setTimeout(fetchScreenshot, 1000);
    };

    const handleImageInteraction = (e: React.MouseEvent, type: string) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        rpc(type, { win_id: windowId, x, y });
    };

    const onMouseMoveImage = (e: React.MouseEvent) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        const el = document.querySelector("#position");
        if (el) el.textContent = `x: ${x}, y: ${y}`;
    };

    return (
        <div className="flex flex-col h-full bg-root overflow-hidden">
            {/* Optimized Header - 64px Strict */}
            <header className="h-16 px-4 flex items-center gap-4 bg-card/80 backdrop-blur-xl border-b border-border z-50 shrink-0">
                <button className="btn btn-icon" onClick={onBack}>
                    <IconArrowLeft />
                </button>
                
                <div className="h-6 w-[1px] bg-border/50"></div>
                
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary whitespace-nowrap">Session #{windowId}</span>
                </div>

                <div className="flex-1 flex items-center gap-2 max-w-2xl mx-auto">
                    <input
                        className="input flex-1 bg-root/40 py-1.5 px-3 font-mono text-sm border-white/5 focus:bg-root/80 transition-all truncate"
                        value={navUrl}
                        onChange={e => setNavUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleNavigate()}
                        placeholder="Navigate URL..."
                    />
                    <button className="btn btn-primary btn-sm px-4" onClick={handleNavigate}>Go</button>
                </div>

                <div className="flex items-center gap-2">
                    <button className="btn btn-sm" onClick={fetchScreenshot}>Refresh</button>
                    <button
                        className={`btn btn-sm font-bold ${isAutoRefresh ? 'bg-success text-white border-success' : 'text-secondary'}`}
                        onClick={() => setIsAutoRefresh(!isAutoRefresh)}
                    >
                        {isAutoRefresh ? 'LIVE' : 'AUTO'}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Viewport */}
                <div className="flex-1 bg-black overflow-auto scroll-custom">
                    {screenshotUrl ? (
                        <img
                            ref={imgRef}
                            onMouseMove={onMouseMoveImage}
                            onClick={(e) => handleImageInteraction(e, "sendElectronClick")}
                            src={screenshotUrl}
                            alt="Remote View"
                            className="cursor-crosshair block max-w-none shadow-2xl"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center flex-col gap-4 text-secondary/40">
                            <div className="w-8 h-8 border-2 border-border border-t-accent rounded-full animate-spin"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Frame</span>
                        </div>
                    )}
                </div>

                {/* Info Sidebar */}
                <aside className="w-80 border-l border-border bg-card/30 backdrop-blur-md p-4 flex flex-col gap-6">
                    <section>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary mb-3">Telemetry</h3>
                        <div className="space-y-2">
                            <div className="p-3 bg-root/50 rounded-lg border border-border/50">
                                <div className="text-[9px] text-secondary/60 uppercase font-bold mb-1">Canvas Resolution</div>
                                <div id="bound" className="font-mono text-xs text-accent">--</div>
                            </div>
                            <div className="p-3 bg-root/50 rounded-lg border border-border/50">
                                <div className="text-[9px] text-secondary/60 uppercase font-bold mb-1">Cursor Pointer</div>
                                <div id="position" className="font-mono text-xs text-accent">x: 0, y: 0</div>
                            </div>
                        </div>
                    </section>

                    <section className="flex-1">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary mb-3">Remote Ops</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button className="btn btn-sm text-[10px] font-bold" onClick={() => rpc('showWindow', { win_id: windowId })}>SHOW</button>
                            <button className="btn btn-sm text-[10px] font-bold" onClick={() => rpc('hideWindow', { win_id: windowId })}>HIDE</button>
                            <button className="btn btn-sm text-[10px] font-bold" onClick={() => rpc('executeJavaScript', { win_id: windowId, code: 'location.reload()' })}>RELOAD</button>
                            <button className="btn btn-sm text-[10px] font-bold border-danger text-danger hover:bg-danger/10" onClick={() => confirm("Close session?") && rpc('closeWindow', { win_id: windowId })}>TERMINATE</button>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
};
