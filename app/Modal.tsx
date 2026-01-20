
import React from 'react';

export const Modal: React.FC<{ title: string, onClose: () => void, children: React.ReactNode, fullScreen?: boolean, bodyStyle?: React.CSSProperties }> = ({ title, onClose, children, fullScreen = false, bodyStyle }) => (
    <div 
        className={`fixed inset-0 flex items-center justify-center z-50 ${fullScreen ? 'p-0' : 'p-4'}`}
        style={{ backgroundColor: fullScreen ? '#000' : 'rgba(0, 0, 0, 0.7)' }}
        onClick={onClose}
    >
        <div 
            className={`bg-card border border-border rounded flex flex-col shadow-xl transition-all ${fullScreen ? 'w-full h-full' : 'w-3/4 h-3/4'}`} 
            onClick={e => e.stopPropagation()}
            style={fullScreen ? { borderRadius: 0, border: 'none' } : {}}
        >
            <div className="flex justify-between items-center p-4 border-b border-border bg-card rounded-t">
                <h3 className="font-bold text-lg">{title}</h3>
                <button onClick={onClose} className="btn btn-sm">Close</button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-root" style={bodyStyle}>
                {children}
            </div>
        </div>
    </div>
);
