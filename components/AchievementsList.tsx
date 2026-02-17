
import React from 'react';
import { Achievement, UserStats } from '../types';
import { ACHIEVEMENTS } from '../constants';

interface AchievementsListProps {
  stats: UserStats;
  onBack: () => void;
}

const AchievementsList: React.FC<AchievementsListProps> = ({ stats, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white">
          <span className="text-2xl">←</span>
        </button>
        <h2 className="text-3xl font-extrabold">Твои <span className="text-orange-500">Достижения</span></h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = stats.unlockedAchievements.includes(achievement.id);
          return (
            <div 
              key={achievement.id}
              className={`p-5 rounded-2xl border-2 flex items-center gap-5 transition-all ${
                isUnlocked 
                ? 'border-orange-500/50 bg-orange-950/10 grayscale-0' 
                : 'border-gray-800 bg-gray-900/20 grayscale opacity-60'
              }`}
            >
              <div className="text-4xl bg-gray-800 w-16 h-16 rounded-xl flex items-center justify-center shadow-inner">
                {achievement.icon}
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-500 leading-tight mt-1">
                  {achievement.description}
                </p>
                {isUnlocked && (
                  <div className="mt-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
                    Разблокировано
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {!stats.unlockedAchievements.length && (
        <div className="text-center py-20 bg-gray-900/10 rounded-3xl border-2 border-dashed border-gray-800 mt-8">
           <div className="text-5xl mb-4">🙊</div>
           <p className="text-gray-500 font-medium italic">Пока пусто. Проходи уроки, чтобы получить первые медали!</p>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;
