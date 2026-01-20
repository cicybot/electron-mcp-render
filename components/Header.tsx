
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Nexus</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Components</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">GitHub</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-sm active:scale-95">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};
