'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserProfile, saveUserProfile } from '@/lib/storage';
import { EXAM_OPTIONS } from '@/lib/constants';
import { TargetExam, UserProfile } from '@/lib/types';
import { User, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [targetExam, setTargetExam] = useState<TargetExam | ''>('');
  const [examDate, setExamDate] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const p = getUserProfile();
    if (p) {
      setProfile(p);
      setName(p.name);
      setTargetExam(p.targetExam);
      setExamDate(p.examDate || '');
    }
  }, []);

  const handleSave = () => {
    if (!name.trim() || !targetExam || !profile) return;
    
    const updatedProfile: UserProfile = {
      ...profile,
      name: name.trim(),
      targetExam: targetExam as TargetExam,
      examDate: examDate || undefined,
    };
    
    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    setIsSaved(true);
    
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!profile) return null;

  return (
    <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={32} style={{ color: '#10B981' }} />
          Edit Profile
        </h1>
        <p style={{ color: '#64748B' }}>Update your personal details and exam goals.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748B', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="input" />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#64748B', marginBottom: '0.5rem', fontWeight: 600 }}>
              <GraduationCap size={16} /> Target Exam
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.5rem' }}>
              {EXAM_OPTIONS.map((exam) => (
                <button 
                  key={exam.value} 
                  onClick={() => setTargetExam(exam.value)} 
                  className={`tag ${targetExam === exam.value ? 'active' : ''}`} 
                  style={{ padding: '0.75rem', justifyContent: 'center', textAlign: 'center', flexDirection: 'column', display: 'flex' }}
                >
                  <span style={{ fontWeight: 600 }}>{exam.label}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{exam.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', color: '#64748B', marginBottom: '0.5rem', fontWeight: 600 }}>Exam Date (optional)</label>
            <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="input" />
          </div>

          <button 
            className="btn-primary" 
            onClick={handleSave} 
            disabled={!name.trim() || !targetExam} 
            style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
          >
            {isSaved ? (
              <>
                <CheckCircle2 size={18} />
                Saved Successfully
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
