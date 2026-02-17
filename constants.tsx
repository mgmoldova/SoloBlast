
import { Lesson, Task, MatchingPair, UserStats, LeaderboardEntry, Achievement, Section } from './types';

/**
 * Утилита для превращения сырых данных из JSON в полноценные разделы и уроки.
 */
export const processRawSections = (rawSections: any[]): Section[] => {
  return rawSections.map((rawSection: any) => {
    const processedLessons = (rawSection.lessons || []).map((rawLesson: any) => {
      const lessonId = rawLesson.id;
      const tasks = (rawLesson.tasks || []).map((rawTask: any, taskIndex: number) => {
        const taskId = `${lessonId}-task-${taskIndex}`;
        
        const processedTask: Task = {
          ...rawTask,
          id: taskId,
        };

        if (rawTask.type === 'matching_pairs' && rawTask.pairs) {
          processedTask.pairs = rawTask.pairs.map((p: any, pairIndex: number) => ({
            ...p,
            id: `${taskId}-pair-${pairIndex}`
          }));
        }

        return processedTask;
      });

      return {
        ...rawLesson,
        tasks
      } as Lesson;
    });

    return {
      ...rawSection,
      lessons: processedLessons
    } as Section;
  });
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    title: 'Первый скрипт',
    description: 'Пройди свой первый урок без единой ошибки.',
    icon: '📜',
    condition: (stats: UserStats) => stats.completedLessons.length >= 1
  },
  {
    id: 'lua_junior',
    title: 'Lua Джуниор',
    description: 'Достигни 3 уровня мастерства.',
    icon: '🥉',
    condition: (stats: UserStats) => stats.level >= 3
  },
  {
    id: 'forum_active',
    title: 'Актив форума',
    description: 'Пройди 3 разных урока.',
    icon: '💬',
    condition: (stats: UserStats) => stats.completedLessons.length >= 3
  },
  {
    id: 'high_streak',
    title: 'В ударе',
    description: 'Набери стрик из 5 правильных ответов.',
    icon: '🔥',
    condition: (stats: UserStats) => stats.streak >= 5
  }
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { username: 'FYP', exp: 99999, level: 999, isLegend: true, avatar: '👑' },
  { username: 'SR_team', exp: 45200, level: 85, avatar: '👨‍💻' },
  { username: 'LUAP', exp: 32150, level: 62, avatar: '🔥' }
];

export const MAX_HEARTS = 5;
