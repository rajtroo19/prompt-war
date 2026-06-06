'use client';

import { useState } from 'react';
import Image from 'next/image';
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
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetExam, setTargetExam] = useState<TargetExam | ''>('');
  const [examDate, setExamDate] = useState('');

  const handleAuth = () => {
    if (!email || !password) return;
    if (isLogin) {
      // Simulate Login
      const profile = createDefaultProfile('Warrior', 'NEET', undefined);
      saveUserProfile(profile);
      onComplete();
    } else {
      if (!name) return;
      setStep(2);
    }
  };

  const handleSetupComplete = () => {
    if (!targetExam) return;
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
              <div style={{ marginBottom: '1.5rem' }}>
                <Image src="/MindPrep.png" alt="MindPrep Logo" width={80} height={80} style={{ borderRadius: '16px', display: 'inline-block' }} priority />
              </div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', background: 'linear-gradient(135deg, #10B981, #059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome to MindPrep
              </h1>
              <p style={{ color: '#64748B', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                Your mental wellness companion for exam preparation. Track your moods, manage stress, and stay balanced.
              </p>
              <button className="btn-primary" onClick={() => setStep(1)} style={{ fontSize: '1.1rem', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                Get Started <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="auth" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="card-gradient">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1E293B' }}>{isLogin ? 'Welcome Back 👋' : 'Create Account'}</h2>
              <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{isLogin ? 'Sign in to access your wellness dashboard.' : 'Sign up to personalize your wellness journey.'}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {!isLogin && (
                  <div>
                    <label htmlFor="auth-name" style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                    <input id="auth-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="input" />
                  </div>
                )}
                <div>
                  <label htmlFor="auth-email" style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
                  <input id="auth-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@example.com" className="input" />
                </div>
                <div>
                  <label htmlFor="auth-password" style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
                  <input id="auth-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="input" />
                </div>
              </div>

              <button className="btn-primary" onClick={handleAuth} disabled={!email || !password || (!isLogin && !name)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isLogin ? 'Log In' : 'Continue'} <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#10B981', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>
                  {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && !isLogin && (
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
                <label htmlFor="exam-date" style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem', fontWeight: 600 }}>Exam date (optional)</label>
                <input id="exam-date" type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="input" />
              </div>
              <button className="btn-primary" onClick={handleSetupComplete} disabled={!targetExam} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                Start My Wellness Journey 🚀
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
