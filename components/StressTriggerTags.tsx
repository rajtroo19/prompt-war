'use client';

import { motion } from 'framer-motion';
import { STRESS_TRIGGERS } from '@/lib/constants';
import { StressTrigger } from '@/lib/types';

interface StressTriggerTagsProps {
  selected: StressTrigger[];
  onToggle: (trigger: StressTrigger) => void;
}

export function StressTriggerTags({ selected, onToggle }: StressTriggerTagsProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        justifyContent: 'center',
      }}
      role="group"
      aria-label="Select stress triggers"
    >
      {STRESS_TRIGGERS.map((trigger, index) => {
        const isActive = selected.includes(trigger.value);
        return (
          <motion.button
            key={trigger.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(trigger.value)}
            className={`tag ${isActive ? 'active' : ''}`}
            aria-pressed={isActive}
            aria-label={`${trigger.label} ${isActive ? '(selected)' : ''}`}
          >
            <span>{trigger.emoji}</span>
            <span>{trigger.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
