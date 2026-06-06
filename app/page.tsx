'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SmilePlus, BarChart3, Wind, Bot, BookHeart, Calendar, Flame, Trophy } from 'lucide-react';
import { getUserProfile, getTodayEntry, calculateStreak, getEntriesLast7Days, getDaysUntilExam } from '@/lib/storage';
import { MOTIVATIONAL_QUOTES, MOOD_CONFIG } from '@/lib/constants';
import { UserProfile, MoodEntry } from '@/lib/types';
import { Onboarding } from '@/components/Onboarding';

const MoodChart = dynamic(() => import('@/components/MoodChart').then((m) => m.MoodChart), { ssr: false });

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [streak, setStreak] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const p = getUserProfile();
    if (!p) { setShowOnboarding(true); } else {
      setProfile(p);
      setTodayEntry(getTodayEntry());
      setStreak(calculateStreak());
      setRecentEntries(getEntriesLast7Days());
    }
    setIsLoaded(true);
  }, []);

  const quote = useMemo(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
  }, []);

  const daysUntilExam = profile?.examDate ? getDaysUntilExam(profile.examDate) : null;

  const handleOnboardingComplete = () => { setShowOnboarding(false); setProfile(getUserProfile()); };

  if (!isLoaded) return <div className="page-container"><div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: '120px' }} />)}</div></div>;
  if (showOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;
  if (!profile) return null;

  const quickCards = [
    { href: '/check-in', icon: SmilePlus, label: 'Check-in', desc: todayEntry ? 'Done today ✓' : 'Log your mood', color: '#10B981' },
    { href: '/journal', icon: BookHeart, label: 'Journal', desc: 'Write your thoughts', color: '#6366F1' },
    { href: '/insights', icon: BarChart3, label: 'Insights', desc: 'View your patterns', color: '#D97706' },
    { href: '/exercises', icon: Wind, label: 'Exercises', desc: 'Breathe & relax', color: '#EC4899' },
    { href: '/coach', icon: Bot, label: 'AI Coach', desc: 'Talk to someone', color: '#F97316' },
  ];

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1E293B' }}>
          Welcome back, {profile.name}! 👋
        </h1>
        <p style={{ color: '#64748B', fontSize: '1rem' }}>
          Preparing for <span style={{ color: '#059669', fontWeight: 600 }}>{profile.targetExam}</span>
          {daysUntilExam !== null && <span> · <span style={{ color: '#D97706' }}>{daysUntilExam} days</span> to go</span>}
        </p>
      </motion.div>

      {/* Top Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-gradient" style={{ textAlign: 'center' }}>
          <Flame size={28} style={{ color: streak > 0 ? '#D97706' : '#CBD5E1', marginBottom: '0.5rem' }} />
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: streak > 0 ? '#D97706' : '#CBD5E1' }}>{streak}</div>
          <div style={{ color: '#64748B', fontSize: '0.85rem' }}>Day Streak</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-gradient" style={{ textAlign: 'center' }}>
          {todayEntry ? (
            <>
              <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{MOOD_CONFIG[todayEntry.mood - 1]?.emoji}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, color: MOOD_CONFIG[todayEntry.mood - 1]?.color }}>{MOOD_CONFIG[todayEntry.mood - 1]?.label}</div>
              <div style={{ color: '#64748B', fontSize: '0.85rem' }}>Today&apos;s Mood</div>
            </>
          ) : (
            <Link href="/check-in" style={{ textDecoration: 'none', color: '#64748B', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <SmilePlus size={28} style={{ color: '#10B981' }} />
              <div style={{ fontSize: '0.9rem' }}>Check in today</div>
            </Link>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card-gradient" style={{ textAlign: 'center' }}>
          <Trophy size={28} style={{ color: profile.badges.length > 0 ? '#10B981' : '#CBD5E1', marginBottom: '0.5rem' }} />
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: profile.badges.length > 0 ? '#10B981' : '#CBD5E1' }}>{profile.badges.length}</div>
          <div style={{ color: '#64748B', fontSize: '0.85rem' }}>Badges Earned</div>
        </motion.div>

        {daysUntilExam !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card-gradient" style={{ textAlign: 'center' }}>
            <Calendar size={28} style={{ color: '#6366F1', marginBottom: '0.5rem' }} />
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: '#6366F1' }}>{daysUntilExam}</div>
            <div style={{ color: '#64748B', fontSize: '0.85rem' }}>Days to {profile.targetExam}</div>
          </motion.div>
        )}
      </div>

      {/* 7-Day Mood Trend */}
      {recentEntries.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B' }}>📊 7-Day Mood Trend</h2>
          <MoodChart />
        </motion.div>
      )}

      {/* Quick Access Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E293B' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {quickCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.href} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }} whileHover={{ scale: 1.03, y: -2 }}>
                <Link href={card.href} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textDecoration: 'none', color: 'inherit', height: '100%' }} aria-label={card.label}>
                  <Icon size={24} style={{ color: card.color }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem', color: '#1E293B' }}>{card.label}</div>
                    <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{card.desc}</div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Motivational Quote */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card" style={{ background: 'linear-gradient(135deg, #F0FDF4, #EFF6FF)', borderColor: '#D1FAE5' }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>💡</div>
        <blockquote style={{ fontSize: '1.05rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '0.75rem', color: '#334155' }}>
          &ldquo;{quote.quote}&rdquo;
        </blockquote>
        <div style={{ color: '#059669', fontWeight: 600, fontSize: '0.9rem' }}>— {quote.author}</div>
        <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{quote.role}</div>
      </motion.div>
    </div>
  );
}
