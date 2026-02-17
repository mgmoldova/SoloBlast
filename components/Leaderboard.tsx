
import React from 'react';
import { LeaderboardEntry, UserStats } from '../types';
import { LEADERBOARD_DATA } from '../constants';

interface LeaderboardProps {
  stats: UserStats;
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ stats, onBack }) => {
  // Combine real leaderboard with current user
  const entries = [...LEADERBOARD_DATA];
  
  // Only add user if they aren't somehow already there
  if (!entries.find(e => e.username === 'Ты (Новичок)')) {
    entries.push({
      username: 'Ты (Новичок)',
      exp: stats.exp,
      level: stats.level,
      avatar: '🧐'
    });
  }

  // Sort by exp descending
  const sortedEntries = entries.sort((a, b) => b.exp - a.exp);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
          <span className="text-2xl">←</span>
        </button>
        <h2 className="text-3xl font-extrabold">Топ <span className="text-orange-500">Скриптеров</span></h2>
      </div>

      <div className="bg-[#161616] rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
        <div className="p-6 bg-orange-600/10 border-b border-gray-800 flex justify-between items-center">
          <span className="text-sm font-bold uppercase tracking-widest text-orange-500">Пользователь</span>
          <span className="text-sm font-bold uppercase tracking-widest text-orange-500">Опыт</span>
        </div>
        
        <div className="divide-y divide-gray-800/50">
          {sortedEntries.map((entry, index) => {
            const isUser = entry.username === 'Ты (Новичок)';
            const isFYP = entry.username === 'FYP';
            
            return (
              <div 
                key={entry.username} 
                className={`flex items-center justify-between p-4 transition-colors ${
                  isUser ? 'bg-orange-600/20' : isFYP ? 'bg-yellow-500/5' : 'hover:bg-gray-800/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 font-black text-center ${
                    index === 0 ? 'text-yellow-400 text-xl' : 
                    index === 1 ? 'text-gray-300' : 
                    index === 2 ? 'text-orange-400' : 'text-gray-600'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-xl shadow-inner border border-gray-700">
                    {entry.avatar}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${isUser ? 'text-orange-400' : 'text-white'}`}>
                        {entry.username}
                      </span>
                      {isFYP && (
                        <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black uppercase">
                          Админ
                        </span>
                      )}
                      {entry.isLegend && (
                        <span className="text-[10px] bg-yellow-600 text-white px-1.5 py-0.5 rounded font-black uppercase">
                          Легенда
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                      Уровень {entry.level}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-black text-lg text-white">{entry.exp.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 font-bold">EXP</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-gray-900 to-[#0d0d0d] rounded-2xl border border-gray-800 text-center">
        <p className="text-gray-400 text-sm">
          Чтобы обогнать <span className="text-orange-500 font-bold">FYP</span>, тебе нужно примерно 
          <span className="text-white font-bold"> 10,000 лет</span> практики. Начинай прямо сейчас!
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
