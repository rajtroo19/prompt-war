'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { getAllMoodEntries, getEntriesLast7Days, getEntriesLastNDays, getAverageMood, getTopTriggers, getMoodByDayOfWeek, getMoodDistribution, getUserProfile } from '@/lib/storage';
import { StreakBadge } from '@/components/StreakBadge';
import { MOOD_CONFIG, STRESS_TRIGGERS } from '@/lib/constants';
import { MoodEntry, UserProfile } from '@/lib/types';

const HeatmapCalendar = dynamic(() => import('@/components/HeatmapCalendar').then((m) => m.HeatmapCalendar), { ssr: false });
const MoodChart = dynamic(() => import('@/components/MoodChart').then((m) => m.MoodChart), { ssr: false });

/* ─── Lightweight Custom SVG Charts ─────────────────── */

function BarChartSVG({ data, horizontal = false }: { data: { name: string; value: number; color?: string }[]; horizontal?: boolean }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  if (horizontal) {
    const barH = 24;
    const gap = 8;
    const h = data.length * (barH + gap);
    return (
      <div style={{ width: '100%' }} role="img" aria-label="Horizontal bar chart">
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: `${gap}px` }}>
            <span style={{ width: '90px', fontSize: '0.75rem', color: '#475569', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
            <div style={{ flex: 1, height: `${barH}px`, background: '#F0F4F8', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${(d.value / maxVal) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} style={{ height: '100%', background: d.color ?? '#EF4444', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '6px' }}>
                <span style={{ fontSize: '0.7rem', color: '#fff', fontWeight: 600 }}>{d.value}</span>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Vertical bars
  const barW = 100 / data.length;
  return (
    <div style={{ width: '100%', height: '180px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '0 4px' }} role="img" aria-label="Vertical bar chart">
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '0.65rem', color: '#64748B' }}>{d.value > 0 ? d.value.toFixed(1) : ''}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${d.value > 0 ? Math.max((d.value / 5) * 120, 8) : 4}px` }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            style={{ width: '100%', maxWidth: '32px', background: d.color ?? '#E2E8F0', borderRadius: '4px 4px 0 0', minHeight: '4px' }}
          />
          <span style={{ fontSize: '0.65rem', color: '#94A3B8' }}>{d.name}</span>
        </div>
      ))}
    </div>
  );
}

function PieChartSVG({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p style={{ color: '#94A3B8', textAlign: 'center' }}>No data yet</p>;

  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 60;
  const ir = 38;
  let cumAngle = -90;

  const slices = data.filter((d) => d.value > 0).map((d) => {
    const angle = (d.value / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    const endAngle = cumAngle;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const largeArc = angle > 180 ? 1 : 0;
    const outerPath = `M ${cx + r * Math.cos(startRad)} ${cy + r * Math.sin(startRad)} A ${r} ${r} 0 ${largeArc} 1 ${cx + r * Math.cos(endRad)} ${cy + r * Math.sin(endRad)} L ${cx + ir * Math.cos(endRad)} ${cy + ir * Math.sin(endRad)} A ${ir} ${ir} 0 ${largeArc} 0 ${cx + ir * Math.cos(startRad)} ${cy + ir * Math.sin(startRad)} Z`;
    return { ...d, path: outerPath };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }} role="img" aria-label="Mood distribution donut chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke="#FFFFFF" strokeWidth="2">
            <title>{`${s.name}: ${s.value}`}</title>
          </path>
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fill="#1E293B" fontSize="18" fontWeight="700">{total}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#94A3B8" fontSize="7">total</text>
      </svg>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {data.filter((d) => d.value > 0).map((d) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#64748B' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color }} />{d.name}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */

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
                <BarChartSVG
                  horizontal
                  data={topTriggers.map((t) => ({
                    name: STRESS_TRIGGERS.find((s) => s.value === t.trigger)?.label ?? t.trigger,
                    value: t.count,
                    color: '#EF4444',
                  }))}
                />
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E293B' }}>🎨 Mood Distribution</h2>
              <PieChartSVG data={moodDist.map((d) => ({ name: d.mood, value: d.count, color: d.color }))} />
            </motion.div>
          </div>

          {/* Mood by Day */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E293B' }}>📅 Average Mood by Day</h2>
            <BarChartSVG
              data={moodByDay.map((d) => ({
                name: d.day,
                value: d.avgMood,
                color: d.avgMood >= 4 ? '#10B981' : d.avgMood >= 3 ? '#EAB308' : d.avgMood >= 2 ? '#F97316' : d.avgMood > 0 ? '#EF4444' : '#E2E8F0',
              }))}
            />
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
