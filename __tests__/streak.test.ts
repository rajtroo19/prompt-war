import {
  saveMoodEntry,
  calculateStreak,
  getAllMoodEntries,
  saveUserProfile,
  createDefaultProfile,
} from '../lib/storage';

beforeEach(() => {
  localStorage.clear();
  const profile = createDefaultProfile('Test Student', 'JEE');
  saveUserProfile(profile);
});

describe('calculateStreak', () => {
  test('returns 0 when no entries exist', () => {
    expect(calculateStreak()).toBe(0);
  });

  test('returns 1 after single check-in today', () => {
    saveMoodEntry(3, [], '');
    expect(calculateStreak()).toBe(1);
  });

  test('increments on consecutive days', () => {
    // Manually insert entries for consecutive days
    const entries = [];
    for (let i = 2; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      entries.push({
        id: `test-${i}`,
        date: d.toISOString().split('T')[0],
        mood: 4 as const,
        stressTriggers: [] as const,
        note: '',
        createdAt: Date.now() - i * 86400000,
      });
    }
    localStorage.setItem('mindprep_mood_entries', JSON.stringify(entries));

    const streak = calculateStreak();
    expect(streak).toBe(3);
  });

  test('resets after missing a day', () => {
    // Create entries with a gap
    const today = new Date();
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Only today and 2 days ago (gap on yesterday)
    const entries = [
      {
        id: 'old',
        date: twoDaysAgo.toISOString().split('T')[0],
        mood: 3,
        stressTriggers: [],
        note: '',
        createdAt: twoDaysAgo.getTime(),
      },
      {
        id: 'today',
        date: today.toISOString().split('T')[0],
        mood: 4,
        stressTriggers: [],
        note: '',
        createdAt: today.getTime(),
      },
    ];
    localStorage.setItem('mindprep_mood_entries', JSON.stringify(entries));

    const streak = calculateStreak();
    expect(streak).toBe(1); // Only today counts, streak broken
  });

  test('does not double-count same day entries', () => {
    saveMoodEntry(3, [], 'First');
    saveMoodEntry(5, [], 'Second'); // Overwrites same day

    const entries = getAllMoodEntries();
    expect(entries.length).toBe(1); // Should not duplicate

    const streak = calculateStreak();
    expect(streak).toBe(1);
  });

  test('streak includes yesterday if no entry today', () => {
    // Entry yesterday only
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const entries = [
      {
        id: 'two-ago',
        date: twoDaysAgo.toISOString().split('T')[0],
        mood: 3,
        stressTriggers: [],
        note: '',
        createdAt: twoDaysAgo.getTime(),
      },
      {
        id: 'yesterday',
        date: yesterday.toISOString().split('T')[0],
        mood: 4,
        stressTriggers: [],
        note: '',
        createdAt: yesterday.getTime(),
      },
    ];
    localStorage.setItem('mindprep_mood_entries', JSON.stringify(entries));

    const streak = calculateStreak();
    expect(streak).toBe(2); // Yesterday + day before
  });
});

describe('Badge unlocking', () => {
  test('first check-in unlocks First Step badge', () => {
    saveMoodEntry(4, [], '');
    const profile = JSON.parse(localStorage.getItem('mindprep_user_profile') ?? '{}');
    const firstStep = profile.badges?.find((b: { id: string }) => b.id === 'first_step');
    expect(firstStep).toBeDefined();
    expect(firstStep?.name).toBe('First Step');
  });

  test('checking in with low mood unlocks Resilient badge', () => {
    // Need at least 2 entries for resilient badge
    saveMoodEntry(4, [], 'Good day');

    // Force a new day entry by manipulating storage
    const entries = getAllMoodEntries();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    entries.push({
      id: 'yesterday-entry',
      date: yesterday.toISOString().split('T')[0],
      mood: 4,
      stressTriggers: [],
      note: '',
      createdAt: yesterday.getTime(),
    });
    localStorage.setItem('mindprep_mood_entries', JSON.stringify(entries));

    // Now check in with low mood
    saveMoodEntry(1, ['self_doubt'], 'Tough day');

    const profile = JSON.parse(localStorage.getItem('mindprep_user_profile') ?? '{}');
    const resilient = profile.badges?.find((b: { id: string }) => b.id === 'resilient');
    expect(resilient).toBeDefined();
  });
});
