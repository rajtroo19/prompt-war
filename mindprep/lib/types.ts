// ─── Core Data Models ────────────────────────────────────────

export type MoodScore = 1 | 2 | 3 | 4 | 5;

export type StressTrigger =
  | 'syllabus_pressure'
  | 'mock_test_results'
  | 'peer_comparison'
  | 'parental_expectations'
  | 'sleep_issues'
  | 'result_anxiety'
  | 'revision_backlog'
  | 'self_doubt'
  | 'physical_health'
  | 'social_isolation';

export type TargetExam = 'NEET' | 'JEE' | 'CUET' | 'CAT' | 'GATE' | 'UPSC' | 'Board';

export interface MoodEntry {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  mood: MoodScore;
  stressTriggers: StressTrigger[];
  note: string;
  createdAt: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: number;
}

export interface UserProfile {
  name: string;
  targetExam: TargetExam;
  examDate?: string;
  streak: number;
  lastCheckIn?: string;
  badges: Badge[];
  onboardingComplete: boolean;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: MoodScore;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ExerciseCompletion {
  id: string;
  exerciseId: string;
  completedAt: number;
  durationSeconds: number;
}

// ─── Badge Definitions ──────────────────────────────────────

export const BADGE_DEFINITIONS: Omit<Badge, 'unlockedAt'>[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Completed your first check-in',
    emoji: '🌱',
  },
  {
    id: 'one_week_warrior',
    name: 'One Week Warrior',
    description: '7-day check-in streak',
    emoji: '⚔️',
  },
  {
    id: 'resilient',
    name: 'Resilient',
    description: 'Checked in after a tough day (mood 1 or 2)',
    emoji: '💪',
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: '30-day check-in streak',
    emoji: '🏅',
  },
  {
    id: 'exam_ready',
    name: 'Exam Ready',
    description: '60-day check-in streak',
    emoji: '🎯',
  },
  {
    id: 'mindful',
    name: 'Mindful',
    description: 'Completed 10 breathing exercises',
    emoji: '🧘',
  },
  {
    id: 'journal_keeper',
    name: 'Journal Keeper',
    description: 'Wrote 10 journal entries',
    emoji: '📝',
  },
];
