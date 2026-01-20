
import { useEffect, useRef, useState } from "react";
import View from "./View";
import { WindowDetail } from "./WindowDetail";
import { DesktopDetail } from "./DesktopDetail";
import { useRpc } from "./RpcContext";

function Render() {
    const { rpc } = useRpc();
    const [mediaUrl, setMediaUrl] = useState("");
    const [mediaInfo, setMediaInfo] = useState<any>(null);
    const [comments, setComments] = useState<any>(null);
    const [title, setTitle] = useState("");
    const [currentUrl, setCurrentUrl] = useState("");
    
    // Parse URL parameters
    const uri = new URL(location.href);
    const desktop = uri.searchParams.get("desktop");
    const winId = uri.searchParams.get("win_id");
    
    if (desktop) {
        return <DesktopDetail onBack={() => window.close()} />;
    }

    if (winId) {
        const initialUrl = uri.searchParams.get("url") || "";
        return (
            <WindowDetail 
                windowId={parseInt(winId)} 
                initialUrl={initialUrl} 
                onBack={() => window.close()} 
            />
        );
    }

    const webviewTag = useRef<null | any>(null);
    const [webContentsId, setWebContentId] = useState<number | null>(null);

    useEffect(() => {
        if (!webviewTag.current) return;
        const webview = webviewTag.current;
        
        const onDomReady = () => {
            setWebContentId(webview.getWebContentsId());
            setTitle(webview.getTitle());
            setCurrentUrl(webview.getURL());
        };

        const onTitleUpdate = ({ title }: any) => {
            setTitle(title);
        };

        webview.addEventListener('dom-ready', onDomReady);
        webview.addEventListener('page-title-updated', onTitleUpdate);
        
        return () => {
            webview.removeEventListener('dom-ready', onDomReady);
            webview.removeEventListener('page-title-updated', onTitleUpdate);
        };
    }, []);

    const post_rpc = async (payload: any) => {
        return rpc(payload.method, payload.params);
    };

    const sideWidth = 320;
    
    return (
        <div className="flex h-full w-full bg-root overflow-hidden">
            <div className="flex-1 relative">
                <webview 
                    ref={webviewTag} 
                    partition={"persist:p_0"} 
                    className="w-full h-full bg-white"
                    src={uri.searchParams.get("u") || "about:blank"} 
                />
            </div>
            
            <div className="w-80 border-l border-border bg-card/50 backdrop-blur-md flex flex-col p-4 overflow-y-auto">
                <div className="mb-6">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-secondary mb-4">State Inspector</h2>
                    <div className="bg-code-bg rounded-lg border border-border/50 p-3 font-mono text-[11px] overflow-hidden">
                        <pre className="text-accent overflow-x-auto">
                            {JSON.stringify({ webContentsId, mediaUrl, currentUrl, title }, null, 2)}
                        </pre>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-secondary">Actions</h2>
                    
                    <div className="grid grid-cols-1 gap-2">
                        <button 
                            className="btn btn-sm btn-primary justify-start gap-2"
                            onClick={async () => {
                                const res = await post_rpc({
                                    method: "executeJavaScript",
                                    params: {
                                        code: `(() => {
                                            const items = document.querySelectorAll('[data-e2e="comment-item"]');
                                            return Array.from(items).map(item => ({ 
                                                text: item.innerText.replace(/\\s+/g, " ").trim() 
                                            }));
                                        })()`,
                                        wc_id: webContentsId
                                    }
                                });
                                setComments({ ts: Date.now(), comments: res });
                            }}
                        >
                            <span>Fetch Comments</span>
                        </button>

                        <button 
                            className="btn btn-sm justify-start"
                            onClick={() => post_rpc({ method: "openDevTools", params: { wc_id: webContentsId } })}
                        >
                            Open DevTools
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Render };
