
import React from 'react';
import { Lesson } from '../types';

interface LessonNodeProps {
  lesson: Lesson;
  isCompleted: boolean;
  isActive: boolean;
  isLocked: boolean;
  offset: number; // -1 (left), 0 (center), 1 (right)
  onStart: (lesson: Lesson) => void;
}

const LessonNode: React.FC<LessonNodeProps> = ({ lesson, isCompleted, isActive, isLocked, offset, onStart }) => {
  const getOffsetClass = () => {
    if (offset === -1) return 'mr-32';
    if (offset === 1) return 'ml-32';
    return '';
  };

  const difficultyIcons = {
    beginner: '👶',
    intermediate: '💻',
    expert: '💀'
  };

  return (
    <div className={`relative flex flex-col items-center mb-12 transition-all ${getOffsetClass()}`}>
      {/* Label Tooltip */}
      <div className={`absolute -top-12 bg-white text-black px-4 py-2 rounded-xl font-bold text-sm shadow-xl whitespace-nowrap transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        {lesson.title}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
      </div>

      {/* The Circle */}
      <button
        disabled={isLocked}
        onClick={() => onStart(lesson)}
        className={`group relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all transform active:scale-90 ${
          isLocked 
            ? 'bg-gray-800 border-b-8 border-gray-900 cursor-not-allowed opacity-50' 
            : isCompleted 
              ? 'bg-orange-500 border-b-8 border-orange-700 hover:bg-orange-400'
              : 'bg-orange-600 border-b-8 border-orange-800 hover:scale-105 shadow-lg shadow-orange-900/40'
        }`}
      >
        {/* Progress Ring for active lesson */}
        {isActive && !isCompleted && (
          <div className="absolute -inset-3 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
        )}
        
        <span className="text-3xl sm:text-4xl drop-shadow-md">
          {isCompleted ? '⭐' : difficultyIcons[lesson.difficulty]}
        </span>

        {/* Floating Badges */}
        {isCompleted && (
          <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-2 border-[#0d0d0d]">
            <span className="text-xs">✔️</span>
          </div>
        )}
      </button>

      {/* Description below (Optional, or just tooltip) */}
      <div className="mt-4 text-center max-w-[120px]">
        <span className={`text-xs font-bold uppercase tracking-tighter ${isLocked ? 'text-gray-600' : 'text-gray-400'}`}>
          {lesson.difficulty === 'beginner' ? 'Нуб' : lesson.difficulty === 'intermediate' ? 'Юзер' : 'Хацкер'}
        </span>
      </div>
    </div>
  );
};

export default LessonNode;
