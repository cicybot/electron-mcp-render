
import React from 'react';

export const Modal: React.FC<{ 
    title: string, 
    onClose: () => void, 
    children: React.ReactNode, 
    fullScreen?: boolean, 
    bodyStyle?: React.CSSProperties 
}> = ({ title, onClose, children, fullScreen = false, bodyStyle }) => (
    <div 
        className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[9999] p-4 sm:p-6"
        style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.75)', 
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
    >
        <div 
            className={`bg-card border border-border/60 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden transition-all ${
                fullScreen ? 'w-full h-full' : 'w-full max-w-xl max-h-[90vh] rounded-3xl'
            }`} 
            style={{ 
                animation: 'slideInFromBottom 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                ...fullScreen ? { borderRadius: 0, border: 'none' } : {}
            }}
            onClick={e => e.stopPropagation()}
        >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-border/50 bg-card/80">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
                    <h3 className="font-black text-[11px] uppercase tracking-[0.2em] text-primary">{title}</h3>
                </div>
                <button 
                    onClick={onClose} 
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-hover border border-transparent hover:border-border/50 transition-all"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest text-secondary group-hover:text-primary">Close</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-secondary group-hover:text-danger transition-colors">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-6 scroll-custom" style={bodyStyle}>
                {children}
            </div>
        </div>
    </div>
);
