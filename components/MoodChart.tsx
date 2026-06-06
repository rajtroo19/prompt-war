'use client';

import { useMemo } from 'react';
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

  const getMoodEmoji = (value: number) => MOOD_CONFIG.find((m) => m.score === value)?.emoji ?? '';
  const getMoodColor = (value: number) => {
    if (value >= 4) return '#10B981';
    if (value >= 3) return '#EAB308';
    if (value >= 2) return '#F97316';
    return '#EF4444';
  };

  const validPoints = data.filter((d) => d.mood !== null);
  const height = mini ? 60 : 160;
  const width = 100; // percentage-based via viewBox
  const padding = { top: 15, right: 10, bottom: mini ? 5 : 25, left: mini ? 5 : 25 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const getX = (i: number) => padding.left + (i / 6) * chartW;
  const getY = (mood: number) => padding.top + chartH - ((mood - 1) / 4) * chartH;

  // Build SVG path for the line
  const linePoints = data
    .map((d, i) => (d.mood !== null ? { x: getX(i), y: getY(d.mood), mood: d.mood } : null))
    .filter(Boolean) as { x: number; y: number; mood: number }[];

  const linePath = linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Area path (fill under the line)
  const areaPath = linePoints.length > 0
    ? `${linePath} L ${linePoints[linePoints.length - 1].x} ${padding.top + chartH} L ${linePoints[0].x} ${padding.top + chartH} Z`
    : '';

  if (mini) {
    return (
      <div style={{ width: '100%', height }}>
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }} aria-label="Mood trend mini chart">
          <defs>
            <linearGradient id="miniGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>
          {areaPath && <path d={areaPath} fill="url(#miniGrad)" />}
          {linePath && <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height }} aria-label="Mood trend chart showing last 7 days">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis grid lines */}
        {[1, 2, 3, 4, 5].map((v) => (
          <g key={v}>
            <line x1={padding.left} y1={getY(v)} x2={padding.left + chartW} y2={getY(v)} stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="2,2" />
            <text x={padding.left - 3} y={getY(v) + 1.5} textAnchor="end" fill="#94A3B8" fontSize="4">{v}</text>
          </g>
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text key={d.date} x={getX(i)} y={height - 3} textAnchor="middle" fill="#94A3B8" fontSize="4">{d.label}</text>
        ))}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

        {/* Line */}
        {linePath && <path d={linePath} fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}

        {/* Dots */}
        {data.map((d, i) => d.mood !== null && (
          <g key={d.date}>
            <circle cx={getX(i)} cy={getY(d.mood)} r="3" fill={getMoodColor(d.mood)} stroke="#FFFFFF" strokeWidth="1.5" />
            <title>{`${d.label}: ${getMoodEmoji(d.mood)} ${d.mood}/5`}</title>
          </g>
        ))}

        {/* No data message */}
        {validPoints.length === 0 && (
          <text x={width / 2} y={height / 2} textAnchor="middle" fill="#94A3B8" fontSize="5">No data yet — check in to see your trend!</text>
        )}
      </svg>
    </div>
  );
}
