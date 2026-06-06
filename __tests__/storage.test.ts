import {
  saveMoodEntry,
  getTodayEntry,
  getAllMoodEntries,
  getEntriesLast7Days,
  getAverageMood,
  getTopTriggers,
  getMoodDistribution,
  saveUserProfile,
  getUserProfile,
  createDefaultProfile,
  saveJournalEntry,
  getAllJournalEntries,
  deleteJournalEntry,
  getDaysUntilExam,
} from '../lib/storage';
import { MoodEntry } from '../lib/types';

beforeEach(() => {
  localStorage.clear();
  // Create a default profile so streak/badge logic works
  const profile = createDefaultProfile('Test Student', 'NEET', '2027-05-01');
  saveUserProfile(profile);
});

describe('saveMoodEntry & retrieval', () => {
  test('saveMoodEntry saves and retrieves correctly', () => {
    const entry = saveMoodEntry(4, ['syllabus_pressure', 'sleep_issues'], 'Feeling okay today');

    expect(entry).toBeDefined();
    expect(entry.mood).toBe(4);
    expect(entry.stressTriggers).toEqual(['syllabus_pressure', 'sleep_issues']);
    expect(entry.note).toBe('Feeling okay today');
    expect(entry.id).toBeTruthy();
    expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const allEntries = getAllMoodEntries();
    expect(allEntries.length).toBe(1);
    expect(allEntries[0].mood).toBe(4);
  });

  test('saveMoodEntry overwrites existing entry for same day', () => {
    saveMoodEntry(3, [], 'First check-in');
    saveMoodEntry(5, ['peer_comparison'], 'Updated check-in');

    const allEntries = getAllMoodEntries();
    expect(allEntries.length).toBe(1);
    expect(allEntries[0].mood).toBe(5);
    expect(allEntries[0].note).toBe('Updated check-in');
  });
});

describe('getTodayEntry', () => {
  test('returns null if no entry today', () => {
    const result = getTodayEntry();
    expect(result).toBeNull();
  });

  test('returns today entry when it exists', () => {
    saveMoodEntry(3, [], 'Test');
    const result = getTodayEntry();

    expect(result).not.toBeNull();
    expect(result?.mood).toBe(3);
  });
});

describe('getEntriesLast7Days', () => {
  test('returns entries within last 7 days only', () => {
    // Save today's entry
    saveMoodEntry(4, [], '');

    const results = getEntriesLast7Days();
    expect(results.length).toBeGreaterThanOrEqual(1);

    // All returned dates should be within last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    for (const entry of results) {
      expect(entry.date >= startDate).toBe(true);
    }
  });
});

describe('getAverageMood', () => {
  test('returns 0 for empty array', () => {
    expect(getAverageMood([])).toBe(0);
  });

  test('calculates correct average', () => {
    const entries: MoodEntry[] = [
      { id: '1', date: '2026-01-01', mood: 3, stressTriggers: [], note: '', createdAt: 1 },
      { id: '2', date: '2026-01-02', mood: 5, stressTriggers: [], note: '', createdAt: 2 },
      { id: '3', date: '2026-01-03', mood: 4, stressTriggers: [], note: '', createdAt: 3 },
    ];
    expect(getAverageMood(entries)).toBe(4);
  });
});

describe('getTopTriggers', () => {
  test('returns top triggers sorted by frequency', () => {
    const entries: MoodEntry[] = [
      { id: '1', date: '2026-01-01', mood: 2, stressTriggers: ['syllabus_pressure', 'sleep_issues'], note: '', createdAt: 1 },
      { id: '2', date: '2026-01-02', mood: 3, stressTriggers: ['syllabus_pressure', 'peer_comparison'], note: '', createdAt: 2 },
      { id: '3', date: '2026-01-03', mood: 2, stressTriggers: ['syllabus_pressure'], note: '', createdAt: 3 },
    ];

    const top = getTopTriggers(entries, 2);
    expect(top.length).toBe(2);
    expect(top[0].trigger).toBe('syllabus_pressure');
    expect(top[0].count).toBe(3);
  });
});

describe('getMoodDistribution', () => {
  test('counts mood scores correctly', () => {
    const entries: MoodEntry[] = [
      { id: '1', date: '2026-01-01', mood: 5, stressTriggers: [], note: '', createdAt: 1 },
      { id: '2', date: '2026-01-02', mood: 5, stressTriggers: [], note: '', createdAt: 2 },
      { id: '3', date: '2026-01-03', mood: 3, stressTriggers: [], note: '', createdAt: 3 },
    ];

    const dist = getMoodDistribution(entries);
    expect(dist[4].count).toBe(2); // mood 5 = index 4
    expect(dist[2].count).toBe(1); // mood 3 = index 2
    expect(dist[0].count).toBe(0); // mood 1 = index 0
  });
});

describe('UserProfile', () => {
  test('createDefaultProfile creates correct structure', () => {
    const profile = createDefaultProfile('Rahul', 'JEE', '2027-01-15');
    expect(profile.name).toBe('Rahul');
    expect(profile.targetExam).toBe('JEE');
    expect(profile.examDate).toBe('2027-01-15');
    expect(profile.streak).toBe(0);
    expect(profile.badges).toEqual([]);
    expect(profile.onboardingComplete).toBe(true);
  });

  test('saveUserProfile and getUserProfile round-trip correctly', () => {
    const profile = createDefaultProfile('Priya', 'NEET');
    saveUserProfile(profile);
    const retrieved = getUserProfile();
    expect(retrieved?.name).toBe('Priya');
    expect(retrieved?.targetExam).toBe('NEET');
  });
});

describe('Journal', () => {
  test('saveJournalEntry and getAllJournalEntries work correctly', () => {
    const entry1 = saveJournalEntry('First journal entry', 4);
    const entry2 = saveJournalEntry('Second entry');

    const all = getAllJournalEntries();
    expect(all.length).toBe(2);
    expect(all[0].content).toBe('First journal entry');
    expect(all[0].mood).toBe(4);
    expect(all[1].content).toBe('Second entry');
    expect(all[1].mood).toBeUndefined();
    expect(entry1.id).toBeTruthy();
    expect(entry2.id).toBeTruthy();
  });

  test('deleteJournalEntry removes the correct entry', () => {
    const entry1 = saveJournalEntry('Keep this');
    const entry2 = saveJournalEntry('Delete this');

    deleteJournalEntry(entry2.id);
    const all = getAllJournalEntries();
    expect(all.length).toBe(1);
    expect(all[0].content).toBe('Keep this');
  });
});

describe('getDaysUntilExam', () => {
  test('returns null for undefined exam date', () => {
    expect(getDaysUntilExam(undefined)).toBeNull();
  });

  test('returns 0 for past dates', () => {
    const result = getDaysUntilExam('2020-01-01');
    expect(result).toBe(0);
  });

  test('returns positive number for future dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const result = getDaysUntilExam(futureDate.toISOString().split('T')[0]);
    expect(result).toBeGreaterThanOrEqual(29);
    expect(result).toBeLessThanOrEqual(31);
  });
});
