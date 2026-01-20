
import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <div className="max-w-2xl text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-block p-3 rounded-2xl bg-blue-50 text-blue-600 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20" />
        </svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-lg mx-auto">
        {description}
      </p>
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <button className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95">
          Edit App.tsx
        </button>
        <button className="px-8 py-3 bg-white text-slate-900 border border-slate-200 font-semibold rounded-xl hover:bg-slate-50 transition-all active:scale-95">
          View Examples
        </button>
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-200">
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 text-sm uppercase tracking-wider">React 18</p>
          <p className="text-xs text-slate-500">Modern concurrency features</p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 text-sm uppercase tracking-wider">TypeScript</p>
          <p className="text-xs text-slate-500">Robust type safety everywhere</p>
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Tailwind</p>
          <p className="text-xs text-slate-500">Utility-first, rapid styling</p>
        </div>
      </div>
    </div>
  );
};
