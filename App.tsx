
import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { EmptyState } from './components/EmptyState';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Header />
      
      <main className="flex-grow flex items-center justify-center p-6">
        <EmptyState 
          title="Ready for your next big idea"
          description="This is your blank canvas. Built with React 18, TypeScript, and Tailwind CSS. Start building something amazing."
        />
      </main>

      <Footer />
    </div>
  );
};

export default App;
