'use client';

import { motion } from 'framer-motion';
import { WellnessCoach } from '@/components/WellnessCoach';

export default function CoachPage() {
  return (
    <div className="page-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1E293B' }}>AI Wellness Coach 🤗</h1>
        <p style={{ color: '#64748B' }}>Your compassionate companion who understands the pressure of exam preparation. Share what&apos;s on your mind.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <WellnessCoach />
      </motion.div>
    </div>
  );
}
