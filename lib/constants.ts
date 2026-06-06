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
    id: 'anulom_vilom',
    name: 'Anulom Vilom (Alternate Nostril)',
    description: 'Ancient Ayurvedic Pranayama to balance the Nadis (energy channels). Perfect for clearing exam brain-fog and harmonizing the left and right brain hemispheres.',
    duration: '4 minutes',
    steps: [
      { phase: 'Inhale Left', duration: 4, instruction: 'Close right nostril. Inhale slowly through left nostril.' },
      { phase: 'Hold', duration: 4, instruction: 'Close both nostrils. Hold the breath.' },
      { phase: 'Exhale Right', duration: 4, instruction: 'Open right nostril. Exhale slowly.' },
      { phase: 'Inhale Right', duration: 4, instruction: 'Inhale slowly through right nostril.' },
      { phase: 'Hold', duration: 4, instruction: 'Close both nostrils. Hold the breath.' },
      { phase: 'Exhale Left', duration: 4, instruction: 'Open left nostril. Exhale slowly.' },
    ],
    cycles: 4,
    color: '#6EE7B7',
  },
  {
    id: 'bhramari',
    name: 'Bhramari (Humming Bee Breath)',
    description: 'A deeply soothing yogic practice from the Hatha Yoga Pradipika. The vibrations instantly calm the nervous system, reducing severe pre-exam anxiety and anger.',
    duration: '3 minutes',
    steps: [
      { phase: 'Prepare', duration: 3, instruction: 'Close your ears with your thumbs and rest fingers gently over eyes.' },
      { phase: 'Deep Inhale', duration: 5, instruction: 'Take a deep breath in through your nose.' },
      { phase: 'Humming Exhale', duration: 10, instruction: 'Exhale slowly while making a deep, steady humming sound (like a bee).' },
      { phase: 'Rest', duration: 5, instruction: 'Keep eyes closed. Feel the vibrations in your mind.' },
    ],
    cycles: 5,
    color: '#818CF8',
  },
  {
    id: 'trataka',
    name: 'Trataka (Point Gazing)',
    description: 'An Ayurvedic purification technique (Shatkarma) for developing intense concentration and memory. Stare at a single point (or candle flame) without blinking.',
    duration: '2 minutes',
    steps: [
      { phase: 'Focus', duration: 30, instruction: 'Gaze intently at a dot on the wall or a candle flame without blinking.' },
      { phase: 'Hold Gaze', duration: 30, instruction: 'Let tears form if they must. Keep your mind completely empty.' },
      { phase: 'Close Eyes', duration: 30, instruction: 'Close eyes gently. Visualize the object in your mind\'s eye.' },
      { phase: 'Relax', duration: 30, instruction: 'Palming: rub hands together and place warm palms over closed eyes.' },
    ],
    cycles: 1,
    color: '#F59E0B',
  },
  {
    id: 'shavasana',
    name: 'Yoga Nidra / Shavasana',
    description: 'The yogic sleep. Used to consciously relax every body part. Highly recommended during rigorous study breaks to prevent burnout.',
    duration: '4 minutes',
    steps: [
      { phase: 'Settle', duration: 10, instruction: 'Lie flat on your back (or sit back). Palms facing up.' },
      { phase: 'Feet & Legs', duration: 15, instruction: 'Tense your toes and legs, then completely release them.' },
      { phase: 'Torso & Hands', duration: 15, instruction: 'Tense your stomach and fists, then let them melt away.' },
      { phase: 'Face & Mind', duration: 15, instruction: 'Squeeze your eyes and jaw, then relax your entire face.' },
      { phase: 'Stillness', duration: 60, instruction: 'Rest in pure stillness. Watch your natural breath.' },
    ],
    cycles: 2,
    color: '#EC4899',
  },
];

// ─── Days of the Week ───────────────────────────────────────

export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
