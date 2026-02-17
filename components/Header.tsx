
import React from 'react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  onReset?: () => void;
}

const Header: React.FC<HeaderProps> = ({ stats, onReset }) => {
  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("⚠️ ВНИМАНИЕ: Ты хочешь полностью очистить историю обучения? Твой опыт, уровень и достижения будут удалены навсегда. Сбросить?")) {
      onReset?.();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-gray-800 px-4 py-3 shadow-lg shadow-black/50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-[0_0_15px_rgba(234,88,12,0.3)]">
            S
          </div>
          <span className="font-extrabold text-xl tracking-tight hidden sm:block">Solo<span className="text-orange-500">Blast</span></span>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-1.5" title="Твой уровень">
            <span className="text-blue-400 font-black text-xs sm:text-sm">LVL</span>
            <span className="font-black text-sm sm:text-lg tabular-nums">{stats.level}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Набранный опыт">
            <span className="text-yellow-500 text-sm sm:text-xl">⚡</span>
            <span className="font-black text-sm sm:text-lg tabular-nums">{stats.exp}</span>
          </div>
          <div className="flex items-center gap-1.5" title="Жизни">
            <span className="text-red-500 text-sm sm:text-xl">❤️</span>
            <span className="font-black text-sm sm:text-lg tabular-nums">{stats.hearts}</span>
          </div>
          
          <div className="h-6 w-[1px] bg-gray-800 mx-1 hidden sm:block"></div>
          
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-900/10 border border-red-900/30 text-red-500 hover:bg-red-900/20 hover:border-red-500 transition-all group"
            title="Очистить весь прогресс"
          >
            <span className="text-sm">🗑️</span>
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Сброс</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
