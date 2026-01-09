
import React from 'react';
import { NavTab } from '../App';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onResetHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, onResetHome }) => {
  return (
    <header className="px-6 py-4 flex items-center justify-between bg-[#002b7a] border-b border-blue-400/20 shadow-md z-10 no-print">
      <div className="flex items-center gap-4 cursor-pointer" onClick={onResetHome}>
        {/* Bajaj Logo Image Container with White Background - Polished */}
        <div className="bg-white p-1.5 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center h-12 w-auto min-w-[70px] border border-blue-100 transition-transform hover:scale-105">
          <img 
            src="https://la.bajajlife.com/assets/Icons/General/BalicLogo2.png" 
            alt="Bajaj Logo" 
            className="h-full object-contain" 
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/120x60/white/00338d?text=BAJAJ';
            }}
          />
        </div>
        <div className="text-white border-l border-white/20 pl-4">
          <div className="font-extrabold text-xl leading-none tracking-tight">BAJAJ LIFE INSURANCE</div>
          <div className="text-[10px] uppercase tracking-[0.2em] opacity-80 mt-1 font-semibold text-blue-100">AI Call Audit Engine</div>
        </div>
      </div>
      
      <div className="hidden lg:flex items-center gap-10 text-white/80 text-sm font-semibold tracking-wide">
        <button 
          onClick={() => onTabChange('analytics')}
          className={`transition-colors border-b-2 pb-1 ${activeTab === 'analytics' ? 'text-orange-400 border-orange-400' : 'hover:text-orange-400 border-transparent hover:border-orange-400'}`}
        >
          Analytics Dashboard
        </button>
        <button 
          onClick={() => onTabChange('history')}
          className={`transition-colors border-b-2 pb-1 ${activeTab === 'history' ? 'text-orange-400 border-orange-400' : 'hover:text-orange-400 border-transparent hover:border-orange-400'}`}
        >
          Compliance History
        </button>
        <button 
          onClick={() => onTabChange('rules')}
          className={`transition-colors border-b-2 pb-1 ${activeTab === 'rules' ? 'text-orange-400 border-orange-400' : 'hover:text-orange-400 border-transparent hover:border-orange-400'}`}
        >
          Risk Rules
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-900/40 rounded-full border border-blue-300/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">System Live</span>
        </div>
        <button className="bg-[#ff7e00] text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-orange-600 transition-all shadow-[0_2px_10px_rgba(255,126,0,0.3)] active:scale-95">
          User Settings
        </button>
      </div>
    </header>
  );
};

export default Header;
