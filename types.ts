
export type TaskType = 'multiple_choice' | 'matching_pairs' | 'theory' | 'fill_blanks';

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface Task {
  id: string;
  type: TaskType;
  question?: string;
  content?: string; // For theory blocks
  codeSnippet?: string;
  options?: string[];
  pairs?: MatchingPair[]; // For matching tasks
  correctAnswer?: string;
  correctAnswers?: string[]; // For fill_blanks (order matters)
  explanation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  tasks: Task[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  exp: number;
  level: number;
  hearts: number;
  streak: number;
  completedLessons: string[];
  unlockedAchievements: string[];
}

export interface LeaderboardEntry {
  username: string;
  exp: number;
  level: number;
  isLegend?: boolean;
  avatar?: string;
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  LEARNING = 'LEARNING',
  ACHIEVEMENTS = 'ACHIEVEMENTS',
  LEADERBOARD = 'LEADERBOARD'
}
