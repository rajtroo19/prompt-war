'use client';

import { motion } from 'framer-motion';
import { Badge, BADGE_DEFINITIONS } from '@/lib/types';
import { Lock } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  badges: Badge[];
}

export function StreakBadge({ streak, badges }: StreakBadgeProps) {
  return (
    <div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="card-gradient"
        style={{ textAlign: 'center', marginBottom: '1.5rem' }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
          {streak > 0 ? '🔥' : '✨'}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: 800,
            background: streak > 0
              ? 'linear-gradient(135deg, #D97706, #F59E0B)'
              : 'linear-gradient(135deg, #94A3B8, #CBD5E1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {streak}
        </div>
        <div style={{ color: '#64748B', fontSize: '0.9rem' }}>
          {streak === 1 ? 'day streak' : 'days streak'}
        </div>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {BADGE_DEFINITIONS.map((def) => {
          const earned = badges.find((b) => b.id === def.id);
          return (
            <motion.div
              key={def.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`badge-card ${earned ? 'unlocked' : 'locked'}`}
              title={earned ? `Unlocked: ${def.description}` : `Locked: ${def.description}`}
              aria-label={`Badge: ${def.name} — ${def.description} ${earned ? '(unlocked)' : '(locked)'}`}
            >
              <span style={{ fontSize: '2rem' }}>
                {earned ? def.emoji : <Lock size={24} style={{ color: '#CBD5E1' }} />}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: earned ? '#059669' : '#94A3B8',
                }}
              >
                {def.name}
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  color: '#94A3B8',
                  lineHeight: 1.3,
                }}
              >
                {def.description}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
