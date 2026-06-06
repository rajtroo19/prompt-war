'use client';

import { useMemo, useState } from 'react';
import { getEntryByDate } from '@/lib/storage';
import { MONTHS, DAYS_OF_WEEK } from '@/lib/constants';
import { STRESS_TRIGGERS } from '@/lib/constants';

const MOOD_COLORS: Record<number, string> = {
  0: '#F0F4F8',
  1: '#FCA5A5',
  2: '#FDBA74',
  3: '#FDE047',
  4: '#86EFAC',
  5: '#6EE7B7',
};

export function HeatmapCalendar() {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    date: string;
    mood: number;
    triggers: string[];
  } | null>(null);

  const cells = useMemo(() => {
    const result: { date: string; mood: number; triggers: string[] }[] = [];
    const today = new Date();

    for (let i = 89; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = getEntryByDate(dateStr);
      result.push({
        date: dateStr,
        mood: entry?.mood ?? 0,
        triggers: entry?.stressTriggers ?? [],
      });
    }

    return result;
  }, []);

  const weeks: typeof cells[] = [];
  let currentWeek: typeof cells = [];

  const firstDate = new Date(cells[0].date + 'T00:00:00');
  const firstDay = firstDate.getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push({ date: '', mood: -1, triggers: [] });
  }

  for (const cell of cells) {
    currentWeek.push(cell);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    for (const cell of week) {
      if (cell.date) {
        const month = new Date(cell.date + 'T00:00:00').getMonth();
        if (month !== lastMonth) {
          monthLabels.push({ label: MONTHS[month], col: weekIndex });
          lastMonth = month;
        }
        break;
      }
    }
  });

  const getTriggerLabel = (value: string) => {
    return STRESS_TRIGGERS.find((t) => t.value === value)?.label ?? value;
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          gap: '0px',
          marginBottom: '0.5rem',
          paddingLeft: '32px',
        }}
      >
        {monthLabels.map((m, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: `${32 + m.col * 18}px`,
              top: 0,
              fontSize: '0.7rem',
              color: '#94A3B8',
            }}
          >
            {m.label}
          </span>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: '2px',
          marginTop: '1.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            marginRight: '4px',
            flexShrink: 0,
          }}
        >
          {DAYS_OF_WEEK.map((day, i) => (
            <span
              key={day}
              style={{
                height: '14px',
                fontSize: '0.6rem',
                color: '#94A3B8',
                display: 'flex',
                alignItems: 'center',
                visibility: i % 2 === 1 ? 'visible' : 'hidden',
              }}
            >
              {day}
            </span>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {week.map((cell, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className="heatmap-cell"
                style={{
                  backgroundColor: cell.mood >= 0 ? MOOD_COLORS[cell.mood] : 'transparent',
                  border: cell.mood === 0 ? '1px solid #E2E8F0' : 'none',
                  cursor: cell.date ? 'pointer' : 'default',
                }}
                aria-label={
                  cell.date
                    ? `${cell.date}: Mood ${cell.mood === 0 ? 'no entry' : cell.mood}/5`
                    : undefined
                }
                onMouseEnter={(e) => {
                  if (cell.date && cell.mood > 0) {
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setTooltip({
                      show: true,
                      x: rect.left + rect.width / 2,
                      y: rect.top - 10,
                      date: cell.date,
                      mood: cell.mood,
                      triggers: cell.triggers,
                    });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '1rem',
          justifyContent: 'flex-end',
        }}
      >
        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Less</span>
        {[0, 1, 2, 3, 4, 5].map((m) => (
          <div
            key={m}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '2px',
              backgroundColor: MOOD_COLORS[m],
              border: m === 0 ? '1px solid #E2E8F0' : 'none',
            }}
          />
        ))}
        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>More</span>
      </div>

      {tooltip?.show && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.8rem',
            zIndex: 1000,
            pointerEvents: 'none',
            minWidth: '160px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            color: '#1E293B',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
            {new Date(tooltip.date + 'T00:00:00').toLocaleDateString('en-IN', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </div>
          <div style={{ color: '#059669', fontWeight: 500 }}>
            Mood: {tooltip.mood}/5
          </div>
          {tooltip.triggers.length > 0 && (
            <div style={{ color: '#64748B', marginTop: '0.25rem' }}>
              {tooltip.triggers.map(getTriggerLabel).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
