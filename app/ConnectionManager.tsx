
import React, { useState } from 'react';
import { useRpc } from './RpcContext';
import { Modal } from './Modal';
import { IconSettings, IconCheck, IconX, IconEdit, IconTrash, IconPlus } from './Icons';

export const ConnectionManager = () => {
    const { availableUrls, rpcUrl, setCurrentUrl, addUrl, removeUrl, updateUrl } = useRpc();
    const [isOpen, setIsOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [newValue, setNewValue] = useState("");

    const startEdit = (url: string) => {
        setEditTarget(url);
        setEditValue(url);
    };

    const saveEdit = () => {
        if (editTarget && editValue && editValue !== editTarget) {
            updateUrl(editTarget, editValue);
        }
        setEditTarget(null);
    };

    const handleSelect = (url: string) => {
        setCurrentUrl(url);
    };

    const handleAdd = () => {
        if (newValue) {
            if (availableUrls.includes(newValue)) {
                alert("URL already exists");
                return;
            }
            addUrl(newValue);
            setCurrentUrl(newValue);
            setNewValue("");
            setIsAdding(false);
        }
    };

    const getDisplayHost = (url: string) => {
        if (!url) return "No RPC";
        try {
            if (url.startsWith('http')) {
                const u = new URL(url);
                return u.host;
            }
            return url;
        } catch (e) {
            return url;
        }
    };

    return (
        <>
            <button 
                className="btn btn-sm flex items-center gap-2 hover:bg-hover border-border/50 group" 
                onClick={() => setIsOpen(true)}
                title={`Active RPC: ${rpcUrl || "None"}`}
            >
                <div className={`w-1.5 h-1.5 rounded-full ${rpcUrl ? 'bg-success shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-danger'}`}></div>
                <span className="font-mono text-[10px] font-bold max-w-[140px] truncate hidden sm:inline-block uppercase tracking-widest text-secondary group-hover:text-primary transition-colors">
                    {getDisplayHost(rpcUrl)}
                </span>
                <IconSettings />
            </button>

            {isOpen && (
                <Modal 
                    title="RPC Endpoints" 
                    onClose={() => setIsOpen(false)} 
                    fullScreen={false}
                >
                    <div className="flex flex-col gap-6 w-full">
                        <p className="text-secondary text-[11px] font-medium leading-relaxed px-1">
                            Connect to your automation server. Select an endpoint to set it as active.
                        </p>
                        
                        <div className="space-y-3">
                            {availableUrls.map(url => (
                                <div 
                                    key={url} 
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                                        url === rpcUrl 
                                            ? 'border-accent/50 bg-accent/5 shadow-[0_0_20px_rgba(59,130,246,0.05)]' 
                                            : 'border-border/40 bg-root/20 hover:border-border/80'
                                    }`}
                                >
                                    <div className="flex items-center justify-center shrink-0">
                                        <input 
                                            type="radio" 
                                            name="rpc_connection"
                                            checked={url === rpcUrl}
                                            onChange={() => handleSelect(url)}
                                            className="w-4 h-4 cursor-pointer accent-accent"
                                        />
                                    </div>
                                    
                                    {editTarget === url ? (
                                        <div className="flex-1 flex gap-2">
                                            <input 
                                                className="input py-1.5 px-3 text-xs flex-1 font-mono bg-root/60 border-accent/30" 
                                                value={editValue}
                                                onChange={e => setEditValue(e.target.value)}
                                                autoFocus
                                                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                                            />
                                            <div className="flex gap-1">
                                                <button className="btn btn-sm btn-icon text-success hover:bg-success/10" onClick={saveEdit}><IconCheck /></button>
                                                <button className="btn btn-sm btn-icon hover:bg-danger/10" onClick={() => setEditTarget(null)}><IconX /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div 
                                                className={`flex-1 font-mono text-[11px] truncate cursor-pointer select-none py-1 ${url === rpcUrl ? 'text-primary font-bold' : 'text-secondary/80'}`} 
                                                onClick={() => handleSelect(url)}
                                            >
                                                {url}
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button className="btn btn-sm btn-icon opacity-50 hover:opacity-100" onClick={(e) => { e.stopPropagation(); startEdit(url); }}><IconEdit /></button>
                                                <button 
                                                    className="btn btn-sm btn-icon opacity-50 hover:opacity-100 hover:text-danger disabled:opacity-10" 
                                                    onClick={(e) => { e.stopPropagation(); if(confirm('Delete connection?')) removeUrl(url); }}
                                                    disabled={availableUrls.length <= 1}
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-border/30">
                            {isAdding ? (
                                 <div className="flex flex-col gap-4 p-5 rounded-2xl border border-accent/20 bg-accent/5 animate-in slide-in-from-bottom-2">
                                    <h4 className="text-[10px] font-black text-accent uppercase tracking-widest">New Connection</h4>
                                    <div className="flex gap-2">
                                        <input 
                                            className="input py-2 px-3 text-xs flex-1 font-mono bg-root/80 border-accent/20"
                                            placeholder="https://host.com/rpc?token=..."
                                            value={newValue}
                                            onChange={e => setNewValue(e.target.value)}
                                            autoFocus
                                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                                        />
                                        <button className="btn btn-primary h-9 px-4 text-[10px] font-bold uppercase tracking-widest" onClick={handleAdd}>Add</button>
                                    </div>
                                    <button className="text-[10px] font-bold text-secondary hover:text-primary uppercase tracking-widest text-left px-1" onClick={() => setIsAdding(false)}>Cancel</button>
                                 </div>
                            ) : (
                                <button 
                                    className="btn w-full border-dashed border-border/60 text-secondary hover:text-primary hover:border-accent/50 py-4 flex items-center justify-center gap-2 hover:bg-accent/5 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest" 
                                    onClick={() => setIsAdding(true)}
                                >
                                    <IconPlus /> Register New Endpoint
                                </button>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};
