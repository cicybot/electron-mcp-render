
import React, { useState, useEffect, useRef } from 'react';

interface WindowThumbnailProps {
    id: number;
    url: string;
    refreshKey: number; // Triggered by parent if needed
    onClick: () => void;
    rpcBaseUrl: string;
    rpcToken?: string;
}

export const WindowThumbnail: React.FC<WindowThumbnailProps> = ({ id, url, refreshKey, onClick, rpcBaseUrl, rpcToken }) => {
    let hostname = 'unknown';
    try {
        hostname = new URL(url).hostname;
    } catch (e) {}

    const [displayedUrl, setDisplayedUrl] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let mounted = true;
        // If already loaded and we're not being explicitly refreshed by parent, skip
        if (isLoaded && refreshKey === 0) return;

        const targetUrl = (rpcBaseUrl ? `${rpcBaseUrl}/windowScreenshot` : '/windowScreenshot') + `?id=${id}&t=${Date.now()}`;
        
        const loadImage = async () => {
            try {
                const headers: Record<string, string> = {};
                if (rpcToken) headers['Authorization'] = `Bearer ${rpcToken}`;

                const response = await fetch(targetUrl, { headers });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const blob = await response.blob();
                const newObjectUrl = URL.createObjectURL(blob);

                if (mounted) {
                    setDisplayedUrl(prev => {
                        if (prev) URL.revokeObjectURL(prev); // Clean up previous blob
                        return newObjectUrl;
                    });
                    setIsLoaded(true); // Mark as successfully loaded
                } else {
                    URL.revokeObjectURL(newObjectUrl);
                }
            } catch (error) {
                console.error('Failed to load thumbnail screenshot:', error);
                // On failure, we don't set isLoaded to true, 
                // allowing it to retry if refreshKey changes or on remount.
            }
        };

        loadImage();
        return () => { 
            mounted = false; 
        };
    }, [id, rpcBaseUrl, rpcToken, refreshKey]); // Removed localRefresh dependency

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (displayedUrl) URL.revokeObjectURL(displayedUrl);
        };
    }, [displayedUrl]);

    const isReady = displayedUrl !== null;

    return (
        <div 
            className={`window-thumb group relative cursor-pointer border-2 transition-all duration-300 transform rounded-xl overflow-hidden bg-black shadow-lg ${isHovered ? 'border-accent -translate-y-1 shadow-accent/20' : 'border-border'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            style={{ aspectRatio: '16/10' }}
        >
            {/* Skeleton / Loading State */}
            {!isReady && (
                <div className="absolute inset-0 bg-code-bg animate-pulse flex items-center justify-center">
                   <div className="w-12 h-[1px] bg-border"></div>
                </div>
            )}
            
            {/* Main Screenshot */}
            {isReady && (
                <img 
                    src={displayedUrl!} 
                    alt={hostname} 
                    className="w-full h-full object-contain transition-opacity duration-300"
                    style={{ opacity: isReady ? 1 : 0 }}
                />
            )}

            {/* Glossy Overlay Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-100 group-hover:via-black/40 transition-all"></div>

            {/* Status Top Bar */}
            <div className="absolute top-2 left-2 right-2 flex justify-between items-center z-20 pointer-events-none">
                 <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/90">CONNECTED</span>
                 </div>
                 <div className="bg-accent/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-sm">
                    #{id}
                 </div>
            </div>

            {/* Bottom Info Panel */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-20 transform translate-y-0 transition-transform">
                <div className="font-bold text-xs text-white truncate mb-0.5 group-hover:text-accent transition-colors">
                    {hostname}
                </div>
                <div className="flex justify-between items-center text-[10px] text-secondary font-medium">
                    <span className="truncate max-w-[70%] opacity-80">{url}</span>
                    <span className="shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">Focus ↵</span>
                </div>
            </div>

            {/* Hover Quick Actions */}
            {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-accent/10 backdrop-blur-[1px] animate-in fade-in duration-200">
                    <div className="bg-black/80 backdrop-blur-xl border border-accent/30 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
                         <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white scale-110">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};
