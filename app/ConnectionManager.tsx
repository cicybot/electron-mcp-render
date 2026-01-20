
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
        setIsOpen(false);
    };

    const handleAdd = () => {
        if (newValue) {
            if (availableUrls.includes(newValue)) {
                alert("URL already exists");
                return;
            }
            addUrl(newValue);
            setCurrentUrl(newValue); // Auto-select the new connection
            setNewValue("");
            setIsAdding(false);
            setIsOpen(false); // Close modal and return to back
        }
    };

    // Helper to extract a friendly host name for display in limited header space
    const getDisplayHost = (url: string) => {
        if (!url) return "No RPC";
        try {
            // If it's a standard URL, return just the host (e.g., 127.0.0.1:3456)
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
                className="btn btn-sm flex items-center gap-2 hover:bg-hover" 
                onClick={() => setIsOpen(true)}
                title={`Active RPC: ${rpcUrl || "None"}`}
            >
                <div className={`w-2 h-2 rounded-full ${rpcUrl ? 'bg-success' : 'bg-danger'}`}></div>
                <span className="font-mono text-[10px] font-bold max-w-[120px] truncate hidden sm:inline-block uppercase tracking-wider">
                    {getDisplayHost(rpcUrl)}
                </span>
                <IconSettings />
            </button>

            {isOpen && (
                <Modal 
                    title="RPC Connections" 
                    onClose={() => setIsOpen(false)} 
                    fullScreen={true}
                    bodyStyle={{ backgroundColor: '#000000' }}
                >
                    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-8 px-4">
                        <div className="text-secondary text-sm text-center max-w-lg mx-auto">
                            Manage your RPC Server connections. Select the active server using the radio button or add new endpoints.
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            {availableUrls.map(url => (
                                <div key={url} className={`flex items-center gap-3 p-4 rounded border transition-colors ${url === rpcUrl ? 'border-accent bg-accent/5' : 'border-border bg-card'}`}>
                                    <label className="flex items-center justify-center cursor-pointer shrink-0" title="Select this server">
                                        <input 
                                            type="radio" 
                                            name="rpc_connection"
                                            checked={url === rpcUrl}
                                            onChange={() => handleSelect(url)}
                                            className="w-5 h-5 cursor-pointer"
                                            style={{accentColor: 'var(--accent)'}}
                                        />
                                    </label>
                                    
                                    {editTarget === url ? (
                                        <div className="flex-1 flex gap-3 animate-in fade-in">
                                            <input 
                                                className="input py-2 px-3 text-sm flex-1 font-mono" 
                                                value={editValue}
                                                onChange={e => setEditValue(e.target.value)}
                                                autoFocus
                                                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                                            />
                                            <div className="flex gap-2">
                                                <button className="btn btn-sm btn-icon text-success border-success" onClick={saveEdit} title="Save"><IconCheck /></button>
                                                <button className="btn btn-sm btn-icon" onClick={() => setEditTarget(null)} title="Cancel"><IconX /></button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div 
                                                className="flex-1 font-mono text-base truncate cursor-pointer select-none" 
                                                onClick={() => handleSelect(url)}
                                            >
                                                {url}
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="btn btn-sm btn-icon opacity-60 hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); startEdit(url); }} title="Edit"><IconEdit /></button>
                                                <button 
                                                    className="btn btn-sm btn-icon opacity-60 hover:opacity-100 hover:text-danger hover:border-danger transition-all disabled:opacity-20" 
                                                    onClick={(e) => { e.stopPropagation(); if(confirm('Delete ' + url + '?')) removeUrl(url); }}
                                                    disabled={availableUrls.length <= 1}
                                                    title="Delete"
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-2 pt-6 border-t border-border">
                            {isAdding ? (
                                 <div className="flex flex-col gap-3 p-6 rounded border border-border bg-card shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <h4 className="font-bold text-sm text-primary mb-1">Add New RPC URL</h4>
                                    <div className="flex items-center gap-3">
                                        <input 
                                            className="input py-2 px-3 text-sm flex-1 font-mono"
                                            placeholder="http://127.0.0.1:3456/rpc"
                                            value={newValue}
                                            onChange={e => setNewValue(e.target.value)}
                                            autoFocus
                                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                                        />
                                        <button className="btn btn-primary whitespace-nowrap px-6" onClick={handleAdd}>Save</button>
                                        <button className="btn whitespace-nowrap" onClick={() => setIsAdding(false)}>Cancel</button>
                                    </div>
                                 </div>
                            ) : (
                                <button 
                                    className="btn w-full border-dashed text-secondary hover:text-primary py-4 flex items-center justify-center gap-2 hover:bg-hover transition-colors rounded-lg" 
                                    onClick={() => setIsAdding(true)}
                                >
                                    <IconPlus /> Add New Connection
                                </button>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};
