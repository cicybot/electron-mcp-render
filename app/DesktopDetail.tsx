
import React, { useState, useEffect, useRef } from 'react';
import { useRpc } from './RpcContext';
import { IconArrowLeft } from './Icons';

export const DesktopDetail = ({ onBack }: { onBack: () => void }) => {
    const { rpc, rpcBaseUrl, rpcToken } = useRpc();
    const [screenshotUrl, setScreenshotUrl] = useState<string>('');
    const [isAutoRefresh, setIsAutoRefresh] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        document.title = "Global Desktop View";
        fetchScreenshot();
        fetchScreenSize();
    }, []);

    const fetchScreenSize = async () => {
        try {
            const screenInfo = await rpc<{ width: number; height: number }>('getDisplayScreenSize');
            if (screenInfo) {
                const sizeElement = document.querySelector("#windowSize");
                if (sizeElement) sizeElement.textContent = `${screenInfo.width}x${screenInfo.height}`;
            }
        } catch (e) {
            console.error('Failed to get screen size:', e);
        }
    };

    const fetchScreenshot = async () => {
        try {
            const url = (rpcBaseUrl ? `${rpcBaseUrl}/displayScreenshot` : '/displayScreenshot') + `?t=${Date.now()}`;
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

    const handleImageInteraction = (e: React.MouseEvent, type: string) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        rpc(type, { win_id: 1, x, y });
    };

    const onMouseMoveImage = (e: React.MouseEvent) => {
        if (!imgRef.current) return;
        const rect = imgRef.current.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        const posEl = document.querySelector("#position");
        if (posEl) posEl.textContent = `x: ${x}, y: ${y}`;
    };

    return (
        <div className="flex flex-col h-full bg-root overflow-hidden">
            <header className="h-16 px-4 flex items-center gap-4 bg-card/80 backdrop-blur-xl border-b border-border z-50 shrink-0">
                <button className="btn btn-icon" onClick={onBack}>
                    <IconArrowLeft />
                </button>
                
                <div className="h-6 w-[1px] bg-border/50"></div>
                
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Desktop Broadcast</span>
                </div>

                <div className="flex-1"></div>

                <div className="flex items-center gap-6 text-[10px] font-mono text-secondary mr-4">
                    <div className="flex flex-col items-end">
                        <span className="opacity-40 font-bold uppercase tracking-tighter text-[8px]">Resolution</span>
                        <span id="windowSize" className="text-accent">Detecting...</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="opacity-40 font-bold uppercase tracking-tighter text-[8px]">Coordinates</span>
                        <span id="position" className="text-accent">x: 0, y: 0</span>
                    </div>
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

            <div className="flex-1 bg-black overflow-auto scroll-custom p-8">
                <div className="inline-block relative shadow-2xl shadow-black">
                    {screenshotUrl ? (
                        <img
                            ref={imgRef}
                            onMouseMove={onMouseMoveImage}
                            onClick={(e) => handleImageInteraction(e, "pyautoguiClick")}
                            src={screenshotUrl}
                            alt="Desktop Stream"
                            className="cursor-crosshair block max-w-none"
                        />
                    ) : (
                        <div className="flex items-center justify-center p-24 text-secondary/20">
                            <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Establishing Stream...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
