
import React from 'react';
import { Home, PlusSquare, Settings, Users } from 'lucide-react';
import { AppTab } from '../types';
import BrandLogo from './BrandLogo';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-[#f8f5f2] shadow-xl relative">
      {/* Header */}
      <header className="p-6 pt-12 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center border-b border-stone-100">
        <h1 className="text-2xl font-bold text-stone-800 tracking-tight italic">Vivenda Literária</h1>
        <BrandLogo size={32} />
      </header>

      {/* Main Content */}
      <main className="flex-grow pb-24">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white/90 backdrop-blur-lg border-t border-stone-200 px-6 py-4 flex justify-between items-center z-30">
        <button 
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'library' ? 'text-stone-900' : 'text-stone-400'}`}
        >
          <Home size={22} />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Estante</span>
        </button>
        <button 
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'feed' ? 'text-stone-900' : 'text-stone-400'}`}
        >
          <Users size={22} />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Feed</span>
        </button>
        <button 
          onClick={() => setActiveTab('add')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'add' ? 'text-stone-900' : 'text-stone-400'}`}
        >
          <PlusSquare size={22} />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Novo</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-stone-900' : 'text-stone-400'}`}
        >
          <Settings size={22} />
          <span className="text-[9px] uppercase tracking-wider font-semibold">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
