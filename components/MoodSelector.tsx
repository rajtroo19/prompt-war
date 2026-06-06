'use client';

import { motion } from 'framer-motion';
import { MOOD_CONFIG } from '@/lib/constants';
import { MoodScore } from '@/lib/types';

interface MoodSelectorProps {
  selected: MoodScore | null;
  onSelect: (mood: MoodScore) => void;
}

export function MoodSelector({ selected, onSelect }: MoodSelectorProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}
      role="radiogroup"
      aria-label="Select your mood"
    >
      {MOOD_CONFIG.map((mood, index) => {
        const isSelected = selected === mood.score;
        return (
          <motion.button
            key={mood.score}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -6, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(mood.score)}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${mood.label} mood - ${mood.emoji}`}
            className={`mood-option ${isSelected ? 'selected' : ''}`}
            style={{
              borderColor: isSelected ? mood.color : '#E2E8F0',
              background: isSelected
                ? `linear-gradient(135deg, ${mood.color}18, ${mood.color}08)`
                : '#FFFFFF',
              boxShadow: isSelected ? `0 4px 20px ${mood.color}25` : '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span className="emoji" style={{ filter: isSelected ? 'none' : 'saturate(0.6)' }}>
              {mood.emoji}
            </span>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: isSelected ? 600 : 400,
                color: isSelected ? mood.color : '#64748B',
              }}
            >
              {mood.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
