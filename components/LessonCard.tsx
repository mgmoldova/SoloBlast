
import React from 'react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  onStart: (lesson: Lesson) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, isCompleted, onStart }) => {
  const difficultyColors = {
    beginner: 'text-green-400 border-green-900/30 bg-green-900/10',
    intermediate: 'text-yellow-400 border-yellow-900/30 bg-yellow-900/10',
    expert: 'text-red-400 border-red-900/30 bg-red-900/10'
  };

  const difficultyLabels = {
      beginner: 'Новичок',
      intermediate: 'Средний',
      expert: 'Профи'
  };

  return (
    <div className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group ${
      isCompleted ? 'border-orange-500/50 bg-orange-950/10' : 'border-gray-800 hover:border-orange-500 bg-[#161616]'
    }`} onClick={() => onStart(lesson)}>
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs px-2 py-1 rounded-full border ${difficultyColors[lesson.difficulty]}`}>
          {difficultyLabels[lesson.difficulty]}
        </span>
        {isCompleted && <span className="text-orange-500 font-bold">✓ Пройдено</span>}
      </div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-orange-400 transition-colors">{lesson.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{lesson.description}</p>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex -space-x-2">
           {[1,2,3].map(i => (
             <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-[#161616] flex items-center justify-center text-[10px]">
               {i}
             </div>
           ))}
        </div>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-xl font-bold text-sm group-hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/20">
          {isCompleted ? 'Повторить' : 'Начать'}
        </button>
      </div>
    </div>
  );
};

export default LessonCard;
