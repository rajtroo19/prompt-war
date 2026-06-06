'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BreathingExercise } from '@/components/BreathingExercise';
import { BREATHING_EXERCISES } from '@/lib/constants';
import { Clock, Wind, Brain, Zap } from 'lucide-react';

const EXERCISE_ICONS: Record<string, typeof Wind> = { anulom_vilom: Wind, bhramari: Brain, trataka: Zap, shavasana: Clock };

export default function ExercisesPage() {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);

  return (
    <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1E293B' }}>Yogic Therapy & Ayurveda 🧘🏽‍♂️</h1>
        <p style={{ color: '#64748B' }}>Ancient Indian practices from the Shastras to ground your mind and conquer exam anxiety.</p>
      </motion.div>

      {activeExercise ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <button className="btn-secondary" onClick={() => setActiveExercise(null)} style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>← Back to practices</button>
          {(() => {
            const exercise = BREATHING_EXERCISES.find((e) => e.id === activeExercise);
            if (!exercise) return null;
            return (
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center', color: '#1E293B' }}>{exercise.name}</h2>
                <p style={{ color: '#64748B', textAlign: 'center', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem', lineHeight: 1.6 }}>{exercise.description}</p>
                <BreathingExercise id={exercise.id} name={exercise.name} steps={exercise.steps} cycles={exercise.cycles} color={exercise.color} onComplete={() => {}} />
              </div>
            );
          })()}
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {BREATHING_EXERCISES.map((exercise, i) => {
            const Icon = EXERCISE_ICONS[exercise.id] || Wind;
            return (
              <motion.div key={exercise.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -4 }}>
                <button onClick={() => setActiveExercise(exercise.id)} className="card" style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '1rem' }} aria-label={`Start ${exercise.name} practice`}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${exercise.color}12`, border: `1px solid ${exercise.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} style={{ color: exercise.color }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.375rem', color: '#1E293B' }}>{exercise.name}</h3>
                    <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>{exercise.description}</p>
                    <span style={{ color: exercise.color, fontSize: '0.8rem', fontWeight: 600 }}>⏱ {exercise.duration} · {exercise.cycles} cycle{exercise.cycles > 1 ? 's' : ''}</span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {!activeExercise && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card" style={{ marginTop: '2rem', background: 'linear-gradient(135deg, #F0FDF4, #EFF6FF)', borderColor: '#D1FAE5' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#1E293B' }}>📜 When to use these Shastra practices</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { when: 'Mental Fog / Sleepiness', exercise: 'Anulom Vilom', why: 'Balances Nadis and energizes the mind' },
              { when: 'High Anxiety / Panic', exercise: 'Bhramari', why: 'Vibrations instantly soothe the nervous system' },
              { when: 'Lack of Concentration', exercise: 'Trataka', why: 'Builds intense focus and memory retention' },
              { when: 'Extreme Burnout', exercise: 'Shavasana', why: 'Provides deep, restorative yogic sleep' },
            ].map((tip) => (
              <div key={tip.when} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ color: '#059669', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>{tip.when}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem', color: '#1E293B' }}>{tip.exercise}</div>
                <div style={{ color: '#94A3B8', fontSize: '0.8rem' }}>{tip.why}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
