'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { getEntriesLast7Days } from '@/lib/storage';
import { MOOD_CONFIG } from '@/lib/constants';

interface MoodChartProps {
  mini?: boolean;
}

export function MoodChart({ mini = false }: MoodChartProps) {
  const data = useMemo(() => {
    const entries = getEntriesLast7Days();
    const today = new Date();
    const result: { date: string; label: string; mood: number | null }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = entries.find((e) => e.date === dateStr);
      const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short' });
      result.push({ date: dateStr, label: dayLabel, mood: entry?.mood ?? null });
    }
    return result;
  }, []);

  const getMoodEmoji = (value: number) => {
    const config = MOOD_CONFIG.find((m) => m.score === value);
    return config?.emoji ?? '';
  };

  if (mini) {
    return (
      <div style={{ width: '100%', height: 80 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="mood" stroke="#10B981" strokeWidth={2} fill="url(#moodGradient)" connectNulls dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 200 }} aria-describedby="mood-chart-desc">
      <span id="mood-chart-desc" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
        Line chart showing mood scores for the last 7 days
      </span>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <XAxis dataKey="label" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#1E293B', fontSize: '0.85rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            formatter={(value: number) => [`${getMoodEmoji(value)} ${value}/5`, 'Mood']}
            labelStyle={{ color: '#64748B' }}
          />
          <Line type="monotone" dataKey="mood" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 5, stroke: '#FFFFFF', strokeWidth: 2 }} activeDot={{ fill: '#10B981', r: 7, stroke: '#FFFFFF', strokeWidth: 2 }} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
