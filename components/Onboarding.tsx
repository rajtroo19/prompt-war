'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXAM_OPTIONS } from '@/lib/constants';
import { createDefaultProfile, saveUserProfile } from '@/lib/storage';
import { TargetExam } from '@/lib/types';
import { ArrowRight, GraduationCap } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [targetExam, setTargetExam] = useState<TargetExam | ''>('');
  const [examDate, setExamDate] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !targetExam) return;
    const profile = createDefaultProfile(name.trim(), targetExam as TargetExam, examDate || undefined);
    saveUserProfile(profile);
    onComplete();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '500px', width: '100%' }}>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="welcome" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🧘</div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome to MindPrep
              </h1>
              <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                Your mental wellness companion for exam preparation. Track your moods, manage stress, and stay balanced on your journey to success.
              </p>
              <button className="btn-primary" onClick={() => setStep(1)} style={{ fontSize: '1.1rem', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Get Started <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="name" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="card-gradient">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1E293B' }}>What&apos;s your name? 👋</h2>
              <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>We&apos;ll use this to personalize your experience.</p>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="input" aria-label="Your name" autoFocus onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) setStep(2); }} style={{ marginBottom: '1.5rem' }} />
              <button className="btn-primary" onClick={() => setStep(2)} disabled={!name.trim()} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Continue <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="exam" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="card-gradient">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1E293B' }}>
                <GraduationCap size={24} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} />
                Which exam are you preparing for?
              </h2>
              <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>This helps us tailor our support for you.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {EXAM_OPTIONS.map((exam) => (
                  <button key={exam.value} onClick={() => setTargetExam(exam.value)} className={`tag ${targetExam === exam.value ? 'active' : ''}`} style={{ padding: '0.75rem', justifyContent: 'center', textAlign: 'center', flexDirection: 'column', display: 'flex' }} aria-pressed={targetExam === exam.value}>
                    <span style={{ fontWeight: 600 }}>{exam.label}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{exam.description}</span>
                  </button>
                ))}
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="exam-date" style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>Exam date (optional)</label>
                <input id="exam-date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="input" />
              </div>
              <button className="btn-primary" onClick={handleSubmit} disabled={!targetExam} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Start My Wellness Journey 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
