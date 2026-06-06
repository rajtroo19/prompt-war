# 🧘 MindPrep — Mental Wellness Tracker for Indian Exam Warriors

> **Because your mental health matters as much as your rank.**

MindPrep is a production-grade mental wellness tracking web application built specifically for Indian students preparing for **NEET, JEE, CUET, CAT, GATE, UPSC**, and **Board Examinations**. It directly addresses the severe mental health challenges faced by millions of students navigating India's competitive exam ecosystem.

## 🎯 Problem Statement

Indian students preparing for NEET, JEE, CUET, CAT, GATE, UPSC, and board examinations face **severe mental health challenges** including:

- 📚 **Syllabus pressure** — vast syllabi with tight timelines
- 👥 **Peer comparison** — constant ranking and benchmarking culture
- 👨‍👩‍👧 **Parental expectations** — family pressure to perform
- 😰 **Result anxiety** — fear of failure and uncertain futures
- 😴 **Sleep deprivation** — irregular schedules affecting wellbeing
- 🏠 **Social isolation** — months of solitary preparation
- 🤔 **Self-doubt** — imposter syndrome and low confidence
- 📋 **Revision backlog** — overwhelming pending workload

Studies show that **1 in 4 Indian students** experience significant stress during exam preparation. Yet most edtech platforms focus solely on academic outcomes, **completely ignoring student mental wellness**.

## 💡 Solution

MindPrep directly addresses each of these challenges:

| Feature | Problem It Solves |
|---------|-------------------|
| **Daily Mood Check-in** (5-emoji scale) | Creates a low-friction daily habit of emotional self-awareness |
| **Exam-Specific Stress Trigger Tagging** | Identifies patterns in exam-related anxiety (syllabus, mocks, results, sleep) |
| **AI Wellness Coach** (Claude API) | Provides personalized, culturally-sensitive mental health support 24/7 |
| **Study-Stress Heatmap Calendar** | Visualizes mood patterns over 90 days — spots burnout before it happens |
| **Streak & Milestone Badges** | Gamifies daily mental health check-ins to build lasting habits |
| **Breathing & Grounding Exercises** | Direct intervention tools for panic, anxiety, and exam-day jitters |
| **Motivational Quotes** (Indian achievers) | Cultural relevance — APJ Abdul Kalam, Swami Vivekananda, and more |
| **Reflection Journal with Export** | Process emotions through writing; export as evidence of growth |
| **Personalized Insights & Analytics** | Data-driven understanding of mood trends, worst days, and top triggers |
| **Exam Countdown Timer** | Keeps perspective — days remaining creates urgency without panic |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + Custom CSS Design System |
| Animations | Framer Motion |
| Charts | Recharts |
| AI | Anthropic Claude API (server-side only) |
| Data | localStorage (offline-first, no backend needed) |
| Icons | Lucide React |
| Fonts | Bricolage Grotesque + Instrument Sans (Google Fonts) |

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with fonts and sidebar
│   ├── page.tsx                # Dashboard / home
│   ├── loading.tsx             # Streaming loading skeleton
│   ├── error.tsx               # Error boundary
│   ├── check-in/page.tsx       # Daily mood check-in
│   ├── journal/page.tsx        # Reflection journal
│   ├── insights/page.tsx       # Heatmap + charts + analytics
│   ├── exercises/page.tsx      # Breathing & grounding exercises
│   ├── coach/page.tsx          # AI wellness coach
│   └── api/
│       └── wellness-coach/route.ts  # Claude API proxy (rate-limited)
├── components/
│   ├── Sidebar.tsx             # Navigation sidebar
│   ├── MoodSelector.tsx        # 5-emoji mood picker
│   ├── StressTriggerTags.tsx   # Exam-specific trigger pills
│   ├── HeatmapCalendar.tsx     # 90-day mood heatmap
│   ├── StreakBadge.tsx          # Streak counter + badge grid
│   ├── BreathingExercise.tsx   # Animated breathing timer
│   ├── WellnessCoach.tsx       # Chat interface for AI coach
│   ├── MoodChart.tsx           # 7-day mood line chart
│   ├── Confetti.tsx            # Celebration animation
│   └── Onboarding.tsx          # First-time user setup
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── constants.ts            # Exam names, triggers, quotes
│   ├── storage.ts              # localStorage CRUD + analytics
│   └── utils.ts                # Utility functions
├── __tests__/
│   ├── storage.test.ts         # Storage logic tests
│   └── streak.test.ts          # Streak calculation tests
├── next.config.ts              # Security headers + optimization
├── .env.example                # Environment variable template
└── public/manifest.json        # PWA manifest
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/rajtroo19/prompt-war.git
cd prompt-war

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local (optional — app works without it)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Optional | Anthropic Claude API key for AI Wellness Coach. The app works fully without it — the coach returns a helpful fallback message. |

> ⚠️ The API key is **server-side only** and never exposed to the client. The API route includes rate limiting (10 requests/minute/IP) and input validation.

## 🔒 Security

- **API key isolation** — `ANTHROPIC_API_KEY` is server-side only, never bundled to client
- **Rate limiting** — In-memory IP-based rate limiter (10 req/min) on the wellness coach API
- **Input sanitization** — All user inputs are validated and trimmed before processing
- **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **No `dangerouslySetInnerHTML`** — Zero raw HTML injection anywhere in the codebase
- **Safe localStorage** — All reads are wrapped in try/catch with fallback values

## ♿ Accessibility (WCAG 2.1 AA)

- All interactive elements have `aria-label` attributes
- Mood emojis use `role="radio"` with `aria-checked` and descriptive labels
- Form inputs have associated `<label>` elements
- Charts have `aria-describedby` with text summaries
- Color contrast ratio ≥ 4.5:1 for all text
- Visible focus rings on all interactive elements (`:focus-visible`)
- `prefers-reduced-motion` support — all animations disabled
- Keyboard navigable — full Tab navigation support
- Skip-to-content accessible via focus

## 🧪 Testing

```bash
npm test
```

Tests cover:
- `saveMoodEntry` — saves and retrieves correctly
- `getTodayEntry` — returns null if no entry exists
- `calculateStreak` — correct streak count for consecutive days
- `calculateStreak` — resets after missing a day
- `getEntriesLast7Days` — returns correct date range

## 📱 Features In Detail

### Daily Mood Check-in
5 animated emoji scale (😔 😟 😐 🙂 😊) with exam-specific stress trigger tags. Prevents duplicate daily check-ins. Confetti celebration on submission.

### AI Wellness Coach
Powered by Claude with a system prompt tuned for Indian student mental health. Passes last 7 days of mood data as context. Includes Indian mental health helpline numbers (iCall, Vandrevala Foundation).

### Study-Stress Heatmap
GitHub-style 90-day heatmap with color intensity based on mood score. Hover tooltips show date, mood, and triggers.

### Breathing & Grounding Exercises
- **Box Breathing** (4-4-4-4) — with animated expanding/contracting circle
- **4-7-8 Breathing** — Dr. Weil's relaxation technique
- **5-4-3-2-1 Grounding** — sensory awareness for anxiety
- **Exam Day Calm** — 2-minute pre-exam routine

### Streak & Badges
7 unlockable badges: First Step, One Week Warrior, Resilient, Consistent (30 days), Exam Ready (60 days), Mindful (10 exercises), Journal Keeper (10 entries).

### Insights & Analytics
- Weekly mood comparison
- Top stress triggers bar chart
- Mood distribution pie chart
- Best/worst mood day analysis
- Personalized AI-generated text insights

## 🙏 Acknowledgments

- Motivational quotes from **Dr. APJ Abdul Kalam**, **Swami Vivekananda**, **Mahatma Gandhi**, **Ratan Tata**, **Kiran Bedi**, **Milkha Singh**, **C.V. Raman**, **Vikram Sarabhai**, and more
- Built for the millions of Indian students who deserve mental health support alongside academic preparation

## 📄 License

MIT License — See [LICENSE](LICENSE) for details.

---

**Made with 💚 for Indian exam warriors**
