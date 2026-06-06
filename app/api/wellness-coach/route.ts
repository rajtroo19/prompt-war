import { NextRequest, NextResponse } from 'next/server';

// ─── In-memory rate limiter (per IP, 10 req/min) ─────────
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count += 1;
  return false;
}

// Clean up stale entries periodically
if (typeof globalThis !== 'undefined') {
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }, 60_000);
  // Allow process to exit
  if (cleanup && typeof cleanup === 'object' && 'unref' in cleanup) {
    (cleanup as NodeJS.Timeout).unref();
  }
}

const SYSTEM_PROMPT = `You are a compassionate mental wellness coach specializing in supporting Indian students preparing for competitive exams like NEET, JEE, UPSC, CAT, GATE, CUET, and board exams. You understand the immense pressure they face from syllabus demands, parental expectations, peer competition, and fear of failure.

Key guidelines:
- Provide empathetic, practical, culturally-sensitive advice
- Keep responses concise (under 120 words)
- Suggest specific coping strategies, breathing techniques, or study-break activities
- Never dismiss their stress — validate first, then support
- Use warm, encouraging language
- Reference Indian cultural context when relevant
- If they express severe distress or mention self-harm, gently encourage speaking to a trusted adult, teacher, or calling iCall (9152987821) or Vandrevala Foundation helpline (1860-2662-345)
- Acknowledge that competition is intense but their worth isn't defined by exam scores`;

// Free models with fallback chain
const MODELS = [
  'google/gemma-3-27b-it:free',
  'meta-llama/llama-3.3-70b-instruct:free',
  'mistralai/mistral-7b-instruct:free',
];

function sanitizeInput(input: string): string {
  return input.trim().slice(0, 2000);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please wait a minute before trying again.',
          message: "You're chatting fast — which means you're engaged! 💚 Take a quick breather (literally — try the box breathing exercise!) and come back in a minute.",
        },
        { status: 429 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        error: 'API key not configured',
        message: "I'm currently in offline mode, but I'm still here for you! 💚 Try the breathing exercises or write in your journal — both are great ways to process your feelings.",
      });
    }

    const body = await request.json();
    const { message, moodContext, history } = body;

    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required and must be a non-empty string.' }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message exceeds maximum length of 2000 characters.' }, { status: 400 });
    }

    const cleanMessage = sanitizeInput(message);
    const cleanContext = moodContext && typeof moodContext === 'string' ? sanitizeInput(moodContext) : '';

    // Build system prompt with mood context
    const systemContent = cleanContext
      ? `${SYSTEM_PROMPT}\n\nStudent's recent mood data: ${cleanContext}`
      : SYSTEM_PROMPT;

    // Build messages array
    const messages: { role: string; content: string }[] = [
      { role: 'system', content: systemContent },
    ];

    // Add history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-8)) {
        if (msg && typeof msg.role === 'string' && typeof msg.content === 'string' && (msg.role === 'user' || msg.role === 'assistant')) {
          messages.push({ role: msg.role, content: sanitizeInput(msg.content) });
        }
      }
    }

    messages.push({ role: 'user', content: cleanMessage });

    // Try models in order until one works
    for (const model of MODELS) {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://mindprep.vercel.app',
            'X-Title': 'MindPrep Wellness Tracker',
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: 250,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content ?? "I hear you, and I want you to know that your feelings are completely valid. Take a moment to breathe deeply — in for 4 counts, hold for 4, out for 4. You've got this. 💚";
          return NextResponse.json({ message: reply });
        }
        // If not ok, try next model
      } catch {
        // Try next model
        continue;
      }
    }

    // All models failed
    return NextResponse.json({
      error: 'AI service temporarily unavailable',
      message: "I'm having a brief moment — like a deep breath before answering. Try again in a moment! In the meantime, remember: you're doing amazing just by being here. 🌟",
    });
  } catch {
    return NextResponse.json({
      error: 'Internal error',
      message: "Something went sideways, but that's okay — we all have those moments! Try again, or take a 2-minute breathing break. You deserve it. 🧘",
    });
  }
}
