
import React, { useState, useEffect } from 'react';

interface MascotProps {
  isVisible: boolean;
  type: 'success' | 'idle';
}

const PRAISES = [
  "Хорош! Админы не спалят.",
  "Четко! Скриптер от бога.",
  "Биндер работает как швейцарские часы!",
  "Сливаю годноту: ты профи!",
  "Красава, лайк на профиль заслужил.",
  "Ебать ты машина! RakNet в страхе.",
  "Скилл растет быстрее, чем цены на донат!",
  "Мощно. Даже фикс не поможет!"
];

const Mascot: React.FC<MascotProps> = ({ isVisible, type }) => {
  const [praise, setPraise] = useState(PRAISES[0]);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    let hideTimer: number;
    let finishTimer: number;

    if (isVisible && type === 'success') {
      // Pick a random praise when triggered
      setPraise(PRAISES[Math.floor(Math.random() * PRAISES.length)]);
      setShouldRender(true);
      setIsAnimatingOut(false);

      // Start the exit sequence after a delay
      hideTimer = window.setTimeout(() => {
        setIsAnimatingOut(true);
        finishTimer = window.setTimeout(() => {
          setShouldRender(false);
        }, 600); // Wait for transition to end
      }, 2500);
    } else if (!isVisible) {
      // If parent hides it before timer, start animating out immediately
      setIsAnimatingOut(true);
      finishTimer = window.setTimeout(() => {
        setShouldRender(false);
      }, 600);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(finishTimer);
    };
  }, [isVisible, type]);

  if (!shouldRender) return null;

  return (
    <div className={`fixed bottom-32 right-4 sm:right-10 z-[60] pointer-events-none flex flex-col items-end transition-all duration-700 ease-in-out transform ${
      isAnimatingOut 
        ? 'opacity-0 translate-x-20 translate-y-10 scale-75 rotate-12' 
        : 'opacity-100 translate-x-0 translate-y-0 scale-100 animate-in slide-in-from-right-20 duration-500'
    }`}>
      {/* Speech Bubble */}
      <div className="bg-white text-black px-5 py-3 rounded-2xl rounded-br-none shadow-2xl mb-4 max-w-[220px] relative border-2 border-orange-500 shadow-orange-900/20">
        <p className="text-sm font-black leading-tight tracking-tight">{praise}</p>
        <div className="absolute -bottom-2 right-0 w-4 h-4 bg-white rotate-45 border-r-2 border-b-2 border-orange-500"></div>
      </div>
      
      {/* Rooster Figure */}
      <div className="relative group">
        <div className="text-8xl sm:text-9xl drop-shadow-[0_20px_35px_rgba(249,115,22,0.4)] animate-bounce pointer-events-auto cursor-pointer select-none">
          🐓
        </div>
        {/* Intense Glow effect */}
        <div className="absolute inset-0 bg-orange-600/30 blur-3xl rounded-full -z-10 animate-pulse"></div>
      </div>
    </div>
  );
};

export default Mascot;
