
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PathLayout from './components/PathLayout';
import TaskRunner from './components/TaskRunner';
import AchievementsList from './components/AchievementsList';
import Leaderboard from './components/Leaderboard';
import { UserStats, Lesson, AppState, Section } from './types';
import { MAX_HEARTS, ACHIEVEMENTS, processRawSections } from './constants';

const STORAGE_KEY = 'soloblast_user_stats';

const DEFAULT_STATS: UserStats = {
  exp: 0,
  level: 1,
  hearts: MAX_HEARTS,
  streak: 0,
  completedLessons: [],
  unlockedAchievements: []
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  
  // Initialize state from localStorage if available
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATS, ...parsed };
      }
    } catch (e) {
      console.error("Failed to parse saved stats:", e);
    }
    return DEFAULT_STATS;
  });

  const [sections, setSections] = useState<Section[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Persistence effect: save stats whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('./lessons.json');
        if (!response.ok) throw new Error('Failed to load lessons');
        const data = await response.json();
        const processed = processRawSections(data);
        setSections(processed);
      } catch (error) {
        console.error("Failed to load sections:", error);
      }
    };
    loadData();
  }, []);

  const resetProgress = () => {
    // Clear the specific key and reload to ensure clean slate
    localStorage.removeItem(STORAGE_KEY);
    // Explicitly set default stats just in case something tries to render before reload
    setStats(DEFAULT_STATS);
    // Reload the page
    window.location.href = window.location.pathname;
  };

  const startLesson = (lesson: Lesson) => {
    if (stats.hearts <= 0) {
      alert("У тебя закончились жизни! Перекури немного, пока админы не выдали новые.");
      return;
    }
    if (!lesson.tasks || lesson.tasks.length === 0) {
      alert("Этот урок пока в разработке. Загляни попозже!");
      return;
    }
    setCurrentLesson(lesson);
    setAppState(AppState.LEARNING);
  };

  const checkAchievements = (newStats: UserStats) => {
    const newlyUnlocked: string[] = [];
    ACHIEVEMENTS.forEach(achievement => {
      if (!newStats.unlockedAchievements.includes(achievement.id) && achievement.condition(newStats)) {
        newlyUnlocked.push(achievement.id);
      }
    });

    if (newlyUnlocked.length > 0) {
      setStats(prev => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, ...newlyUnlocked]
      }));
      
      const lastUnlocked = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[newlyUnlocked.length - 1]);
      if (lastUnlocked) {
        setShowNotification(`Получено достижение: ${lastUnlocked.title} ${lastUnlocked.icon}`);
        setTimeout(() => setShowNotification(null), 4000);
      }
    }
  };

  const handleLessonFinish = (score: number, livesLost: number) => {
    setStats(prev => {
      const newExp = prev.exp + score;
      const newLevel = Math.floor(newExp / 100) + 1;
      const newHearts = Math.max(0, prev.hearts - livesLost);
      const isSuccess = livesLost < MAX_HEARTS;
      const newCompleted = currentLesson && isSuccess
        ? [...new Set([...prev.completedLessons, currentLesson.id])] 
        : prev.completedLessons;

      const newStats = {
        ...prev,
        exp: newExp,
        level: newLevel,
        hearts: newHearts,
        completedLessons: newCompleted,
        streak: isSuccess ? prev.streak + 1 : 0
      };

      setTimeout(() => checkAchievements(newStats), 100);
      return newStats;
    });
    setAppState(AppState.DASHBOARD);
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden selection:bg-orange-500/30">
      <Header stats={stats} onReset={resetProgress} />

      <main className="max-w-4xl mx-auto px-4">
        {(appState === AppState.DASHBOARD || appState === AppState.ACHIEVEMENTS || appState === AppState.LEADERBOARD) && (
          <>
            <div className="py-10 text-center animate-in fade-in zoom-in-95 duration-700">
              <h1 className="text-4xl sm:text-6xl font-black mb-4 tracking-tighter">
                Твой путь <span className="text-orange-500 underline decoration-orange-600/30 decoration-4 underline-offset-8">скриптера</span>
              </h1>
              <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto font-medium">
                Освой Lua, SAMP API и RakNet в стиле Blast.hk. Стань легендой форума!
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
               <button onClick={() => setAppState(AppState.DASHBOARD)} className={`px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${appState === AppState.DASHBOARD ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'bg-gray-900/50 text-gray-500 hover:text-gray-300 border border-gray-800'}`}>Уроки</button>
               <button onClick={() => setAppState(AppState.LEADERBOARD)} className={`px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${appState === AppState.LEADERBOARD ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'bg-gray-900/50 text-gray-500 hover:text-gray-300 border border-gray-800'}`}>Топ</button>
               <button onClick={() => setAppState(AppState.ACHIEVEMENTS)} className={`px-5 py-2.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all relative ${appState === AppState.ACHIEVEMENTS ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'bg-gray-900/50 text-gray-500 hover:text-gray-300 border border-gray-800'}`}>Медали</button>
            </div>
          </>
        )}

        {appState === AppState.DASHBOARD && (
          <PathLayout 
            sections={sections} 
            completedLessons={stats.completedLessons} 
            onStartLesson={startLesson} 
          />
        )}

        {appState === AppState.ACHIEVEMENTS && <AchievementsList stats={stats} onBack={() => setAppState(AppState.DASHBOARD)} />}
        {appState === AppState.LEADERBOARD && <Leaderboard stats={stats} onBack={() => setAppState(AppState.DASHBOARD)} />}

        {appState === AppState.LEARNING && currentLesson && (
          <TaskRunner 
            tasks={currentLesson.tasks} 
            onFinish={handleLessonFinish}
            onCancel={() => setAppState(AppState.DASHBOARD)}
          />
        )}
      </main>

      {showNotification && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] bg-[#1a1a1a] text-white px-8 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] font-bold animate-in slide-in-from-bottom-10 border-2 border-orange-500 flex items-center gap-4">
          <div className="text-3xl">🏆</div>
          <div>
            <div className="text-orange-500 text-xs uppercase tracking-widest font-black">Новая ачивка!</div>
            <div className="text-lg">{showNotification}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
