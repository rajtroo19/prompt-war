'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { getAllMoodEntries, getEntriesLast7Days, getEntriesLastNDays, getAverageMood, getTopTriggers, getMoodByDayOfWeek, getMoodDistribution, getUserProfile } from '@/lib/storage';
import { StreakBadge } from '@/components/StreakBadge';
import { MOOD_CONFIG, STRESS_TRIGGERS } from '@/lib/constants';
import { MoodEntry, UserProfile } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const HeatmapCalendar = dynamic(() => import('@/components/HeatmapCalendar').then((m) => m.HeatmapCalendar), { ssr: false });
const MoodChart = dynamic(() => import('@/components/MoodChart').then((m) => m.MoodChart), { ssr: false });

export default function InsightsPage() {
  const [allEntries, setAllEntries] = useState<MoodEntry[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { setAllEntries(getAllMoodEntries()); setProfile(getUserProfile()); setIsLoaded(true); }, []);

  const last7 = useMemo(() => getEntriesLast7Days(), [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps
  const last14 = useMemo(() => getEntriesLastNDays(14), [isLoaded]); // eslint-disable-line react-hooks/exhaustive-deps
  const prevWeek = useMemo(() => last14.filter((e) => !last7.some((l) => l.id === e.id)), [last7, last14]);
  const avgThisWeek = useMemo(() => getAverageMood(last7), [last7]);
  const avgLastWeek = useMemo(() => getAverageMood(prevWeek), [prevWeek]);
  const topTriggers = useMemo(() => getTopTriggers(allEntries), [allEntries]);
  const moodByDay = useMemo(() => getMoodByDayOfWeek(allEntries), [allEntries]);
  const moodDist = useMemo(() => getMoodDistribution(allEntries), [allEntries]);

  const bestDay = useMemo(() => { const days = moodByDay.filter((d) => d.count > 0); return days.length ? days.reduce((a, b) => (a.avgMood > b.avgMood ? a : b)) : null; }, [moodByDay]);
  const worstDay = useMemo(() => { const days = moodByDay.filter((d) => d.count > 0); return days.length ? days.reduce((a, b) => (a.avgMood < b.avgMood ? a : b)) : null; }, [moodByDay]);

  const generateInsight = () => {
    const insights: string[] = [];
    if (worstDay && bestDay && worstDay.day !== bestDay.day) insights.push(`You tend to feel most stressed on ${worstDay.day}s (avg mood: ${worstDay.avgMood.toFixed(1)}) — consider planning lighter study sessions the evening before.`);
    if (avgThisWeek > avgLastWeek && avgLastWeek > 0) insights.push(`Your mood improved this week (${avgThisWeek.toFixed(1)} vs ${avgLastWeek.toFixed(1)} last week). Keep doing what you're doing! 🌟`);
    else if (avgThisWeek < avgLastWeek && avgLastWeek > 0) insights.push(`Your mood dipped slightly this week (${avgThisWeek.toFixed(1)} vs ${avgLastWeek.toFixed(1)} last week). That's okay — try a breathing exercise or talk to someone you trust. 💙`);
    if (topTriggers.length > 0) { const t = STRESS_TRIGGERS.find((s) => s.value === topTriggers[0].trigger); if (t) insights.push(`"${t.label}" is your most frequent stress trigger (${topTriggers[0].count} times). Identifying patterns is the first step to managing them. 💪`); }
    return insights.length > 0 ? insights : ["Keep checking in daily to unlock personalized insights! We're building your wellness picture. 📊"];
  };

  const tooltipStyle = { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#1E293B', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };

  if (!isLoaded) return <div className="page-container"><div className="skeleton" style={{ height: '500px' }} /></div>;

  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1E293B' }}>Your Insights 📊</h1>
        <p style={{ color: '#64748B' }}>{allEntries.length} check-ins recorded. Here&apos;s what your data reveals.</p>
      </motion.div>

      {allEntries.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1E293B' }}>No data yet</h3>
          <p style={{ color: '#64748B' }}>Complete your first check-in to start seeing insights!</p>
        </motion.div>
      ) : (
        <>
          {/* Personalized Insights */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #F0FDF4, #EFF6FF)', borderColor: '#D1FAE5' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1E293B' }}>💡 Personalized Insights</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {generateInsight().map((insight, i) => <p key={i} style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, paddingLeft: '1rem', borderLeft: '2px solid #10B981' }}>{insight}</p>)}
            </div>
          </motion.div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.25rem' }}>This Week Avg</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: avgThisWeek >= 3.5 ? '#059669' : avgThisWeek >= 2.5 ? '#D97706' : '#EF4444' }}>{avgThisWeek > 0 ? avgThisWeek.toFixed(1) : '—'}</div>
              <div style={{ fontSize: '1.2rem' }}>{avgThisWeek > 0 && MOOD_CONFIG[Math.round(avgThisWeek) - 1]?.emoji}</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Last Week Avg</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: avgLastWeek >= 3.5 ? '#059669' : avgLastWeek >= 2.5 ? '#D97706' : '#EF4444' }}>{avgLastWeek > 0 ? avgLastWeek.toFixed(1) : '—'}</div>
              <div style={{ fontSize: '1.2rem' }}>{avgLastWeek > 0 && MOOD_CONFIG[Math.round(avgLastWeek) - 1]?.emoji}</div>
            </motion.div>
            {bestDay && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ textAlign: 'center' }}>
                <div style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Best Mood Day</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{bestDay.day}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>avg {bestDay.avgMood.toFixed(1)}/5</div>
              </motion.div>
            )}
          </div>

          {/* Heatmap */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E293B' }}>🗓️ 90-Day Mood Heatmap</h2>
            <HeatmapCalendar />
          </motion.div>

          {/* 7-Day Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E293B' }}>📈 7-Day Mood Trend</h2>
            <MoodChart />
          </motion.div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {topTriggers.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E293B' }}>🎯 Top Stress Triggers</h2>
                <div style={{ width: '100%', height: 200 }} aria-describedby="triggers-desc">
                  <span id="triggers-desc" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Bar chart showing top stress triggers</span>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topTriggers.map((t) => ({ name: STRESS_TRIGGERS.find((s) => s.value === t.trigger)?.label ?? t.trigger, count: t.count }))} layout="vertical" margin={{ top: 0, right: 10, left: 80, bottom: 0 }}>
                      <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="count" fill="#EF4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E293B' }}>🎨 Mood Distribution</h2>
              <div style={{ width: '100%', height: 200 }} aria-describedby="mood-dist-desc">
                <span id="mood-dist-desc" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Pie chart showing mood distribution</span>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={moodDist.filter((d) => d.count > 0)} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="count">
                      {moodDist.filter((d) => d.count > 0).map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} formatter={(value: number, name: string) => [value, name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {moodDist.filter((d) => d.count > 0).map((d) => (
                  <div key={d.mood} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#64748B' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color }} />{d.mood}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Mood by Day */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E293B' }}>📅 Average Mood by Day</h2>
            <div style={{ width: '100%', height: 200 }} aria-describedby="day-mood-desc">
              <span id="day-mood-desc" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Bar chart showing average mood by day of week</span>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodByDay} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <XAxis dataKey="day" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                  <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value.toFixed(1), 'Avg Mood']} />
                  <Bar dataKey="avgMood" radius={[4, 4, 0, 0]}>
                    {moodByDay.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.avgMood >= 4 ? '#10B981' : entry.avgMood >= 3 ? '#EAB308' : entry.avgMood >= 2 ? '#F97316' : entry.avgMood > 0 ? '#EF4444' : '#E2E8F0'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Streak & Badges */}
          {profile && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="card">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1E293B' }}>🏆 Streak & Badges</h2>
              <StreakBadge streak={profile.streak} badges={profile.badges} />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
