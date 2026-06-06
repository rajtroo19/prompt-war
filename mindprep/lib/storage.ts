import {
  MoodEntry,
  UserProfile,
  JournalEntry,
  Badge,
  ExerciseCompletion,
  MoodScore,
  StressTrigger,
  BADGE_DEFINITIONS,
  ChatMessage,
} from './types';

// ─── Keys ───────────────────────────────────────────────────

const KEYS = {
  MOOD_ENTRIES: 'mindprep_mood_entries',
  USER_PROFILE: 'mindprep_user_profile',
  JOURNAL_ENTRIES: 'mindprep_journal_entries',
  EXERCISE_COMPLETIONS: 'mindprep_exercise_completions',
  CHAT_MESSAGES: 'mindprep_chat_messages',
} as const;

// ─── Utility ────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── User Profile ───────────────────────────────────────────

export function getUserProfile(): UserProfile | null {
  return getItem<UserProfile | null>(KEYS.USER_PROFILE, null);
}

export function saveUserProfile(profile: UserProfile): void {
  setItem(KEYS.USER_PROFILE, profile);
}

export function createDefaultProfile(name: string, targetExam: UserProfile['targetExam'], examDate?: string): UserProfile {
  return {
    name,
    targetExam,
    examDate,
    streak: 0,
    badges: [],
    onboardingComplete: true,
  };
}

// ─── Mood Entries ───────────────────────────────────────────

export function getAllMoodEntries(): MoodEntry[] {
  return getItem<MoodEntry[]>(KEYS.MOOD_ENTRIES, []);
}

export function saveMoodEntry(mood: MoodScore, stressTriggers: StressTrigger[], note: string): MoodEntry {
  const entries = getAllMoodEntries();
  const today = getToday();

  // Remove existing entry for today if any
  const filtered = entries.filter((e) => e.date !== today);

  const entry: MoodEntry = {
    id: generateId(),
    date: today,
    mood,
    stressTriggers,
    note,
    createdAt: Date.now(),
  };

  filtered.push(entry);
  setItem(KEYS.MOOD_ENTRIES, filtered);

  // Update streak and badges
  updateStreakAndBadges(entry);

  return entry;
}

export function getTodayEntry(): MoodEntry | null {
  const entries = getAllMoodEntries();
  const today = getToday();
  return entries.find((e) => e.date === today) ?? null;
}

export function getEntriesLast7Days(): MoodEntry[] {
  const entries = getAllMoodEntries();
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const startDate = sevenDaysAgo.toISOString().split('T')[0];

  return entries
    .filter((e) => e.date >= startDate && e.date <= getToday())
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getEntriesLastNDays(n: number): MoodEntry[] {
  const entries = getAllMoodEntries();
  const now = new Date();
  const nDaysAgo = new Date(now);
  nDaysAgo.setDate(nDaysAgo.getDate() - (n - 1));
  const startDate = nDaysAgo.toISOString().split('T')[0];

  return entries
    .filter((e) => e.date >= startDate && e.date <= getToday())
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getEntryByDate(date: string): MoodEntry | null {
  const entries = getAllMoodEntries();
  return entries.find((e) => e.date === date) ?? null;
}

// ─── Streak Calculation ─────────────────────────────────────

export function calculateStreak(): number {
  const entries = getAllMoodEntries();
  if (entries.length === 0) return 0;

  // Sort entries by date descending
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const today = getToday();
  
  // If no entry today or yesterday, streak is 0
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (sorted[0].date !== today && sorted[0].date !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(sorted[0].date);

  for (let i = 1; i < sorted.length; i++) {
    const expectedPrevDate = new Date(currentDate);
    expectedPrevDate.setDate(expectedPrevDate.getDate() - 1);
    const expectedStr = expectedPrevDate.toISOString().split('T')[0];

    if (sorted[i].date === expectedStr) {
      streak++;
      currentDate = expectedPrevDate;
    } else if (sorted[i].date === currentDate.toISOString().split('T')[0]) {
      // Duplicate date, skip
      continue;
    } else {
      break;
    }
  }

  return streak;
}

function updateStreakAndBadges(entry: MoodEntry): void {
  const profile = getUserProfile();
  if (!profile) return;

  const streak = calculateStreak();
  profile.streak = streak;
  profile.lastCheckIn = entry.date;

  // Check for badge unlocks
  const newBadges: Badge[] = [];
  const allEntries = getAllMoodEntries();

  const badgeChecks: Record<string, () => boolean> = {
    first_step: () => allEntries.length >= 1,
    one_week_warrior: () => streak >= 7,
    resilient: () => entry.mood <= 2 && allEntries.length > 1,
    consistent: () => streak >= 30,
    exam_ready: () => streak >= 60,
  };

  for (const def of BADGE_DEFINITIONS) {
    const check = badgeChecks[def.id];
    if (check && check() && !profile.badges.some((b) => b.id === def.id)) {
      newBadges.push({ ...def, unlockedAt: Date.now() });
    }
  }

  profile.badges = [...profile.badges, ...newBadges];
  saveUserProfile(profile);
}

// ─── Journal ────────────────────────────────────────────────

export function getAllJournalEntries(): JournalEntry[] {
  return getItem<JournalEntry[]>(KEYS.JOURNAL_ENTRIES, []);
}

export function saveJournalEntry(content: string, mood?: MoodScore): JournalEntry {
  const entries = getAllJournalEntries();
  const entry: JournalEntry = {
    id: generateId(),
    date: getToday(),
    content,
    mood,
    createdAt: Date.now(),
  };

  entries.push(entry);
  setItem(KEYS.JOURNAL_ENTRIES, entries);

  // Check journal badge
  checkJournalBadge(entries.length);

  return entry;
}

export function deleteJournalEntry(id: string): void {
  const entries = getAllJournalEntries().filter((e) => e.id !== id);
  setItem(KEYS.JOURNAL_ENTRIES, entries);
}

function checkJournalBadge(count: number): void {
  if (count >= 10) {
    const profile = getUserProfile();
    if (profile && !profile.badges.some((b) => b.id === 'journal_keeper')) {
      const def = BADGE_DEFINITIONS.find((d) => d.id === 'journal_keeper');
      if (def) {
        profile.badges.push({ ...def, unlockedAt: Date.now() });
        saveUserProfile(profile);
      }
    }
  }
}

// ─── Exercise Completions ───────────────────────────────────

export function getExerciseCompletions(): ExerciseCompletion[] {
  return getItem<ExerciseCompletion[]>(KEYS.EXERCISE_COMPLETIONS, []);
}

export function saveExerciseCompletion(exerciseId: string, durationSeconds: number): ExerciseCompletion {
  const completions = getExerciseCompletions();
  const completion: ExerciseCompletion = {
    id: generateId(),
    exerciseId,
    completedAt: Date.now(),
    durationSeconds,
  };

  completions.push(completion);
  setItem(KEYS.EXERCISE_COMPLETIONS, completions);

  // Check mindful badge
  if (completions.length >= 10) {
    const profile = getUserProfile();
    if (profile && !profile.badges.some((b) => b.id === 'mindful')) {
      const def = BADGE_DEFINITIONS.find((d) => d.id === 'mindful');
      if (def) {
        profile.badges.push({ ...def, unlockedAt: Date.now() });
        saveUserProfile(profile);
      }
    }
  }

  return completion;
}

// ─── Chat Messages ──────────────────────────────────────────

export function getChatMessages(): ChatMessage[] {
  return getItem<ChatMessage[]>(KEYS.CHAT_MESSAGES, []);
}

export function saveChatMessage(role: 'user' | 'assistant', content: string): ChatMessage {
  const messages = getChatMessages();
  const msg: ChatMessage = {
    id: generateId(),
    role,
    content,
    timestamp: Date.now(),
  };
  messages.push(msg);
  setItem(KEYS.CHAT_MESSAGES, messages);
  return msg;
}

export function clearChatMessages(): void {
  setItem(KEYS.CHAT_MESSAGES, []);
}

// ─── Analytics Helpers ──────────────────────────────────────

export function getAverageMood(entries: MoodEntry[]): number {
  if (entries.length === 0) return 0;
  return entries.reduce((sum, e) => sum + e.mood, 0) / entries.length;
}

export function getTopTriggers(entries: MoodEntry[], topN = 3): { trigger: StressTrigger; count: number }[] {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    for (const trigger of entry.stressTriggers) {
      counts[trigger] = (counts[trigger] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .map(([trigger, count]) => ({ trigger: trigger as StressTrigger, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN);
}

export function getMoodByDayOfWeek(entries: MoodEntry[]): { day: string; avgMood: number; count: number }[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayData: Record<number, { total: number; count: number }> = {};

  for (let i = 0; i < 7; i++) {
    dayData[i] = { total: 0, count: 0 };
  }

  for (const entry of entries) {
    const dayIndex = new Date(entry.date + 'T00:00:00').getDay();
    dayData[dayIndex].total += entry.mood;
    dayData[dayIndex].count += 1;
  }

  return days.map((day, i) => ({
    day,
    avgMood: dayData[i].count > 0 ? Math.round((dayData[i].total / dayData[i].count) * 10) / 10 : 0,
    count: dayData[i].count,
  }));
}

export function getMoodDistribution(entries: MoodEntry[]): { mood: string; count: number; color: string }[] {
  const labels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];
  const colors = ['#F87171', '#FB923C', '#FCD34D', '#86EFAC', '#6EE7B7'];
  const counts = [0, 0, 0, 0, 0];

  for (const entry of entries) {
    counts[entry.mood - 1]++;
  }

  return labels.map((mood, i) => ({ mood, count: counts[i], color: colors[i] }));
}

export function getDaysUntilExam(examDate?: string): number | null {
  if (!examDate) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exam = new Date(examDate + 'T00:00:00');
  const diff = exam.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
