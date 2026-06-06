'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllJournalEntries, saveJournalEntry, deleteJournalEntry } from '@/lib/storage';
import { JournalEntry, MoodScore } from '@/lib/types';
import { MOOD_CONFIG } from '@/lib/constants';
import { Plus, Trash2, Download, X } from 'lucide-react';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<MoodScore | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setEntries(getAllJournalEntries().reverse()); setIsLoaded(true); }, []);

  const handleSave = () => { if (!content.trim()) return; const entry = saveJournalEntry(content.trim(), mood); setEntries((prev) => [entry, ...prev]); setContent(''); setMood(undefined); setShowForm(false); };
  const handleDelete = (id: string) => { deleteJournalEntry(id); setEntries((prev) => prev.filter((e) => e.id !== id)); };

  const handleExportPDF = () => {
    const text = entries.map((e) => `${new Date(e.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n${e.mood ? `Mood: ${MOOD_CONFIG[e.mood - 1]?.emoji} ${MOOD_CONFIG[e.mood - 1]?.label}` : ''}\n\n${e.content}\n\n${'─'.repeat(50)}\n`).join('\n');
    const header = `MindPrep — My Wellness Journal\nExported: ${new Date().toLocaleDateString('en-IN')}\n${'═'.repeat(50)}\n\n`;
    const blob = new Blob([header + text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `mindprep-journal-${new Date().toISOString().split('T')[0]}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  if (!isLoaded) return <div className="page-container"><div className="skeleton" style={{ height: '400px' }} /></div>;

  return (
    <div className="page-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#1E293B' }}>Reflection Journal 📖</h1>
          <p style={{ color: '#64748B' }}>Write your thoughts, feelings, and reflections.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {entries.length > 0 && (
            <button className="btn-secondary" onClick={handleExportPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }} aria-label="Export journal">
              <Download size={16} /> Export
            </button>
          )}
          <button className="btn-primary" onClick={() => { setShowForm(true); setTimeout(() => contentRef.current?.focus(), 100); }} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }} aria-label="New journal entry">
            <Plus size={16} /> New Entry
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card" style={{ marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: '#1E293B' }}>New Entry</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.25rem' }} aria-label="Close form"><X size={20} /></button>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>How are you feeling? (optional)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {MOOD_CONFIG.map((m) => (
                  <button key={m.score} onClick={() => setMood(mood === m.score ? undefined : m.score)} style={{ fontSize: '1.5rem', background: mood === m.score ? `${m.color}15` : 'transparent', border: `2px solid ${mood === m.score ? m.color : '#E2E8F0'}`, borderRadius: '8px', padding: '0.375rem 0.5rem', cursor: 'pointer', transition: 'all 0.2s ease' }} aria-label={m.label} aria-pressed={mood === m.score}>
                    {m.emoji}
                  </button>
                ))}
              </div>
            </div>
            <textarea ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write about your day, your feelings, or anything on your mind..." className="textarea" style={{ minHeight: '150px', marginBottom: '1rem' }} aria-label="Journal entry content" />
            <button className="btn-primary" onClick={handleSave} disabled={!content.trim()} style={{ width: '100%' }}>Save Entry ✨</button>
          </motion.div>
        )}
      </AnimatePresence>

      {entries.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1E293B' }}>Your journal is empty</h3>
          <p style={{ color: '#64748B', marginBottom: '1rem' }}>Start writing to process your thoughts and track your emotional journey.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>Write your first entry</button>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {entries.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{new Date(entry.createdAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {entry.mood && <span style={{ fontSize: '1.2rem' }}>{MOOD_CONFIG[entry.mood - 1]?.emoji}</span>}
                </div>
                <button onClick={() => handleDelete(entry.id)} style={{ background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', padding: '0.25rem', transition: 'color 0.2s' }} aria-label={`Delete entry from ${entry.date}`}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#EF4444')} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#CBD5E1')}>
                  <Trash2 size={16} />
                </button>
              </div>
              <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{entry.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
