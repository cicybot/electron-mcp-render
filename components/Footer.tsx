
import React from 'react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full py-8 border-t border-slate-200 bg-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500">
          © {year} React Nexus Starter. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Privacy</a>
          <a href="#" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Terms</a>
          <a href="#" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};
