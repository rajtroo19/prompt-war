import { StressTrigger, TargetExam } from './types';

// ─── Exam Names ─────────────────────────────────────────────

export const EXAM_OPTIONS: { value: TargetExam; label: string; description: string }[] = [
  { value: 'NEET', label: 'NEET', description: 'Medical Entrance' },
  { value: 'JEE', label: 'JEE', description: 'Engineering Entrance' },
  { value: 'CUET', label: 'CUET', description: 'University Entrance' },
  { value: 'CAT', label: 'CAT', description: 'MBA Entrance' },
  { value: 'GATE', label: 'GATE', description: 'PG Engineering' },
  { value: 'UPSC', label: 'UPSC', description: 'Civil Services' },
  { value: 'Board', label: 'Board Exams', description: 'Class 10/12' },
];

// ─── Stress Triggers ────────────────────────────────────────

export const STRESS_TRIGGERS: { value: StressTrigger; label: string; emoji: string }[] = [
  { value: 'syllabus_pressure', label: 'Syllabus Pressure', emoji: '📚' },
  { value: 'mock_test_results', label: 'Mock Test Results', emoji: '📝' },
  { value: 'peer_comparison', label: 'Peer Comparison', emoji: '👥' },
  { value: 'parental_expectations', label: 'Parental Expectations', emoji: '👨‍👩‍👧' },
  { value: 'sleep_issues', label: 'Sleep Issues', emoji: '😴' },
  { value: 'result_anxiety', label: 'Result Anxiety', emoji: '😰' },
  { value: 'revision_backlog', label: 'Revision Backlog', emoji: '📋' },
  { value: 'self_doubt', label: 'Self Doubt', emoji: '🤔' },
  { value: 'physical_health', label: 'Physical Health', emoji: '🏥' },
  { value: 'social_isolation', label: 'Social Isolation', emoji: '🏠' },
];

// ─── Mood Emojis & Labels ───────────────────────────────────

export const MOOD_CONFIG = [
  { score: 1 as const, emoji: '😔', label: 'Very Low', color: '#F87171' },
  { score: 2 as const, emoji: '😟', label: 'Low', color: '#FB923C' },
  { score: 3 as const, emoji: '😐', label: 'Okay', color: '#FCD34D' },
  { score: 4 as const, emoji: '🙂', label: 'Good', color: '#86EFAC' },
  { score: 5 as const, emoji: '😊', label: 'Great', color: '#6EE7B7' },
];

// ─── Motivational Quotes ────────────────────────────────────

export const MOTIVATIONAL_QUOTES = [
  {
    quote: "Dream is not that which you see while sleeping, it is something that does not let you sleep.",
    author: "Dr. APJ Abdul Kalam",
    role: "Former President of India",
  },
  {
    quote: "You have to dream before your dreams can come true.",
    author: "Dr. APJ Abdul Kalam",
    role: "Former President of India",
  },
  {
    quote: "In a day, when you don't come across any problems — you can be sure that you are travelling in a wrong path.",
    author: "Swami Vivekananda",
    role: "Philosopher & Spiritual Leader",
  },
  {
    quote: "Take up one idea. Make that one idea your life. Think of it, dream of it, live on that idea.",
    author: "Swami Vivekananda",
    role: "Philosopher & Spiritual Leader",
  },
  {
    quote: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi",
    role: "Father of the Nation",
  },
  {
    quote: "Strength does not come from physical capacity. It comes from an indomitable will.",
    author: "Mahatma Gandhi",
    role: "Father of the Nation",
  },
  {
    quote: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Ratan Tata",
    role: "Indian Industrialist",
  },
  {
    quote: "Don't take rest after your first victory because if you fail in second, more lips are waiting to say that your first victory was just luck.",
    author: "Dr. APJ Abdul Kalam",
    role: "Former President of India",
  },
  {
    quote: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
    role: "Father of the Nation",
  },
  {
    quote: "The mind is everything. What you think you become.",
    author: "Gautam Buddha",
    role: "Spiritual Teacher",
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Chanakya",
    role: "Ancient Indian Philosopher",
  },
  {
    quote: "Learning gives creativity, creativity leads to thinking, thinking provides knowledge, knowledge makes you great.",
    author: "Dr. APJ Abdul Kalam",
    role: "Former President of India",
  },
  {
    quote: "If you want to shine like a sun, first burn like a sun.",
    author: "Dr. APJ Abdul Kalam",
    role: "Former President of India",
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Kiran Bedi",
    role: "First Woman IPS Officer",
  },
  {
    quote: "Don't stop when you are tired, stop when you are done.",
    author: "Milkha Singh",
    role: "The Flying Sikh",
  },
  {
    quote: "I have not failed. I've just found 10,000 ways that won't work. Keep trying.",
    author: "C.V. Raman",
    role: "Nobel Laureate in Physics",
  },
  {
    quote: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking.",
    author: "Narayan Murthy",
    role: "Founder of Infosys",
  },
  {
    quote: "Arise, awake, and stop not till the goal is reached.",
    author: "Swami Vivekananda",
    role: "Philosopher & Spiritual Leader",
  },
  {
    quote: "Hard work beats talent when talent doesn't work hard.",
    author: "Viswanathan Anand",
    role: "Chess Grandmaster",
  },
  {
    quote: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Vikram Sarabhai",
    role: "Father of Indian Space Programme",
  },
];

// ─── Encouraging Messages ───────────────────────────────────

export const ENCOURAGEMENT_MESSAGES: Record<number, string[]> = {
  1: [
    "It's okay to have tough days. You're not alone in this. 💙",
    "Remember: even the brightest stars have dark nights. You'll shine again. ✨",
    "Be gentle with yourself today. Your feelings are valid. 🤗",
  ],
  2: [
    "Things might feel difficult right now, but you're showing up — that takes courage. 💪",
    "Every small step forward counts. You're doing better than you think. 🌟",
    "Tough times don't last, but tough people do. Keep going! 🙌",
  ],
  3: [
    "You're steady and holding it together — that's strength. 💫",
    "A neutral day is still a day you showed up. That matters! 🎯",
    "Balance is a superpower. You're doing just fine. ⚡",
  ],
  4: [
    "Great to see you feeling good! You've earned this positive energy. 🌈",
    "Your hard work is paying off. Keep this momentum going! 🚀",
    "When you feel good, remember — you deserve it. 😊",
  ],
  5: [
    "You're on fire today! 🔥 This energy is amazing!",
    "What a wonderful day! Cherish this feeling. 🌺",
    "You're absolutely crushing it! This is your moment. ⭐",
  ],
};

// ─── AI Coach Suggested Prompts ─────────────────────────────

export const SUGGESTED_PROMPTS = [
  "I failed my mock test today and feel terrible",
  "I can't sleep the night before exams",
  "My parents are disappointed in my scores",
  "I feel like I'll never be able to cover the syllabus",
  "Everyone else seems smarter than me",
  "I'm feeling burnt out from studying",
  "Help me create a study break routine",
  "I feel guilty whenever I take a break",
];

// ─── Breathing Exercise Config ──────────────────────────────

export const BREATHING_EXERCISES = [
  {
    id: 'box_breathing',
    name: 'Box Breathing',
    description: 'Equal counts of inhale, hold, exhale, and hold. Used by Navy SEALs to stay calm under pressure.',
    duration: '4 minutes',
    steps: [
      { phase: 'Inhale', duration: 4, instruction: 'Breathe in slowly through your nose' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath gently' },
      { phase: 'Exhale', duration: 4, instruction: 'Breathe out slowly through your mouth' },
      { phase: 'Hold', duration: 4, instruction: 'Hold your breath gently' },
    ],
    cycles: 4,
    color: '#6EE7B7',
  },
  {
    id: '478_breathing',
    name: '4-7-8 Breathing',
    description: 'Dr. Andrew Weil\'s relaxation technique. Perfect for calming pre-exam nerves.',
    duration: '3 minutes',
    steps: [
      { phase: 'Inhale', duration: 4, instruction: 'Breathe in quietly through your nose' },
      { phase: 'Hold', duration: 7, instruction: 'Hold your breath' },
      { phase: 'Exhale', duration: 8, instruction: 'Exhale completely through your mouth, making a whoosh sound' },
    ],
    cycles: 4,
    color: '#818CF8',
  },
  {
    id: 'grounding_54321',
    name: '5-4-3-2-1 Grounding',
    description: 'A sensory awareness technique to bring you back to the present moment when anxiety hits.',
    duration: '5 minutes',
    steps: [
      { phase: '5 Things You See', duration: 60, instruction: 'Look around and name 5 things you can see right now' },
      { phase: '4 Things You Touch', duration: 45, instruction: 'Notice 4 things you can physically feel' },
      { phase: '3 Things You Hear', duration: 30, instruction: 'Listen for 3 distinct sounds around you' },
      { phase: '2 Things You Smell', duration: 20, instruction: 'Identify 2 things you can smell' },
      { phase: '1 Thing You Taste', duration: 15, instruction: 'Notice 1 thing you can taste' },
    ],
    cycles: 1,
    color: '#F59E0B',
  },
  {
    id: 'exam_day_calm',
    name: 'Exam Day Calm',
    description: 'A 2-minute quick-calm routine designed specifically for exam morning jitters.',
    duration: '2 minutes',
    steps: [
      { phase: 'Deep Inhale', duration: 5, instruction: 'Take a deep breath in — feel your belly expand' },
      { phase: 'Slow Exhale', duration: 7, instruction: 'Let it all out slowly — release the tension' },
      { phase: 'Affirm', duration: 3, instruction: 'Say to yourself: "I am prepared. I am capable."' },
      { phase: 'Deep Inhale', duration: 5, instruction: 'Breathe in confidence and calm' },
      { phase: 'Slow Exhale', duration: 7, instruction: 'Breathe out any remaining doubt' },
      { phase: 'Affirm', duration: 3, instruction: 'Say: "I will do my best, and that is enough."' },
    ],
    cycles: 2,
    color: '#EC4899',
  },
];

// ─── Days of the Week ───────────────────────────────────────

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
