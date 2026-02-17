
import React from 'react';
import { Section, Lesson } from '../types';
import LessonNode from './LessonNode';

interface PathLayoutProps {
  sections: Section[];
  completedLessons: string[];
  onStartLesson: (lesson: Lesson) => void;
}

const PathLayout: React.FC<PathLayoutProps> = ({ sections, completedLessons, onStartLesson }) => {
  // We calculate lesson globally to determine if they are locked
  const allLessons = sections.flatMap(s => s.lessons);

  return (
    <div className="relative flex flex-col items-center py-10 min-h-screen">
      {sections.map((section, sIndex) => {
        // Find the index of the first lesson of this section in allLessons array
        const prevLessonsCount = sections.slice(0, sIndex).reduce((acc, s) => acc + s.lessons.length, 0);

        return (
          <div key={section.id} className="w-full flex flex-col items-center mb-16">
            {/* Section Header */}
            <div className="w-full max-w-lg mb-12 p-6 bg-orange-600 rounded-3xl text-white shadow-xl shadow-orange-900/20 relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-2xl font-black uppercase tracking-tight">{section.title}</h2>
                <p className="opacity-90 font-medium">{section.description}</p>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl group-hover:scale-110 transition-transform">
                {sIndex === 0 ? '💾' : sIndex === 1 ? '💬' : '💀'}
              </div>
            </div>

            {/* Path Items for this Section */}
            <div className="flex flex-col items-center w-full max-w-md relative">
              {section.lessons.map((lesson, lIndex) => {
                const globalIndex = prevLessonsCount + lIndex;
                const isCompleted = completedLessons.includes(lesson.id);
                
                // A lesson is locked if the previous one globally is not completed
                const isLocked = globalIndex > 0 && !completedLessons.includes(allLessons[globalIndex - 1].id);
                
                const isActive = !isCompleted && !isLocked;

                // Winding pattern logic
                const cycle = globalIndex % 4;
                let offset = 0;
                if (cycle === 1) offset = 1;
                if (cycle === 3) offset = -1;

                return (
                  <LessonNode
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={isCompleted}
                    isActive={isActive}
                    isLocked={isLocked}
                    offset={offset}
                    onStart={onStartLesson}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
      
      {/* Future Content Teaser */}
      <div className="mt-8 flex flex-col items-center opacity-30 grayscale pointer-events-none">
         <div className="w-16 h-16 rounded-full bg-gray-800 border-b-4 border-gray-900 flex items-center justify-center text-2xl">
           🔒
         </div>
         <span className="text-xs font-bold mt-2 text-gray-500 uppercase">Следи за обновлениями на Blast.hk</span>
      </div>
    </div>
  );
};

export default PathLayout;
