'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MoodSelector } from '@/components/MoodSelector';
import { StressTriggerTags } from '@/components/StressTriggerTags';
import { Confetti } from '@/components/Confetti';
import { MoodScore, StressTrigger, MoodEntry } from '@/lib/types';
import { saveMoodEntry, getTodayEntry } from '@/lib/storage';
import { MOOD_CONFIG, ENCOURAGEMENT_MESSAGES } from '@/lib/constants';
import { CheckCircle2, Edit3 } from 'lucide-react';

export default function CheckInPage() {
  const [selectedMood, setSelectedMood] = useState<MoodScore | null>(null);
  const [triggers, setTriggers] = useState<StressTrigger[]>([]);
  const [note, setNote] = useState('');
  const [todayEntry, setTodayEntry] = useState<MoodEntry | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const entry = getTodayEntry();
    if (entry) {
      setTodayEntry(entry);
      setSelectedMood(entry.mood);
      setTriggers(entry.stressTriggers);
      setNote(entry.note);
    }
    setIsLoaded(true);
  }, []);

  const handleToggleTrigger = (trigger: StressTrigger) => {
    setTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = () => {
    if (selectedMood === null) return;

    const entry = saveMoodEntry(selectedMood, triggers, note);
    setTodayEntry(entry);
    setIsSubmitted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const encouragement = useMemo(() => {
    if (!selectedMood) return '';
    const messages = ENCOURAGEMENT_MESSAGES[selectedMood];
    return messages[Math.floor(Math.random() * messages.length)];
  }, [selectedMood, isSubmitted]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isLoaded) {
    return (
      <div className="page-container">
        <div className="skeleton" style={{ height: '400px' }} />
      </div>
    );
  }

  // Show today's entry if already checked in and not editing
  if (todayEntry && !isSubmitted && isLoaded) {
    const moodConfig = MOOD_CONFIG[todayEntry.mood - 1];
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-gradient"
          style={{ textAlign: 'center' }}
        >
          <CheckCircle2
            size={48}
            style={{ color: '#6EE7B7', marginBottom: '1rem' }}
          />
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.8rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
            }}
          >
            Today&apos;s Check-in Complete!
          </h1>
          <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>
            You already checked in today. Here&apos;s what you logged:
          </p>

          <div
            style={{
              fontSize: '4rem',
              marginBottom: '0.5rem',
            }}
          >
            {moodConfig?.emoji}
          </div>
          <div
            style={{
              fontSize: '1.2rem',
              fontWeight: 600,
              color: moodConfig?.color,
              marginBottom: '1rem',
            }}
          >
            {moodConfig?.label}
          </div>

          {todayEntry.stressTriggers.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              {todayEntry.stressTriggers.map((t) => (
                <span
                  key={t}
                  className="tag active"
                  style={{ cursor: 'default' }}
                >
                  {t.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {todayEntry.note && (
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1rem',
                color: '#94A3B8',
                fontStyle: 'italic',
                textAlign: 'left',
              }}
            >
              &ldquo;{todayEntry.note}&rdquo;
            </div>
          )}

          <button
            className="btn-secondary"
            onClick={() => {
              setTodayEntry(null);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Edit3 size={16} />
            Update Today&apos;s Entry
          </button>
        </motion.div>
      </div>
    );
  }

  // Show submission success
  if (isSubmitted && selectedMood) {
    return (
      <div className="page-container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Confetti active={showConfetti} />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-gradient"
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {MOOD_CONFIG[selectedMood - 1]?.emoji}
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: '1rem',
              color: MOOD_CONFIG[selectedMood - 1]?.color,
            }}
          >
            Check-in Saved!
          </h2>
          <p
            style={{
              color: '#94A3B8',
              fontSize: '1rem',
              lineHeight: 1.6,
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            {encouragement}
          </p>
        </motion.div>
      </div>
    );
  }

  // Check-in form
  return (
    <div className="page-container" style={{ maxWidth: '650px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
          }}
        >
          How are you feeling? 🌿
        </h1>
        <p style={{ color: '#94A3B8' }}>
          Take a moment to check in with yourself. There are no wrong answers.
        </p>
      </motion.div>

      {/* Step 1: Mood */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
        style={{ marginBottom: '1.5rem' }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
            textAlign: 'center',
          }}
        >
          Your mood right now
        </h2>
        <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
      </motion.div>

      {/* Step 2: Triggers */}
      {selectedMood !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ marginBottom: '1.5rem' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              textAlign: 'center',
            }}
          >
            What&apos;s affecting you? (optional)
          </h2>
          <p
            style={{
              color: '#64748B',
              fontSize: '0.85rem',
              textAlign: 'center',
              marginBottom: '1.25rem',
            }}
          >
            Select any that apply
          </p>
          <StressTriggerTags selected={triggers} onToggle={handleToggleTrigger} />
        </motion.div>
      )}

      {/* Step 3: Note */}
      {selectedMood !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ marginBottom: '1.5rem' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.1rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            Quick note (optional)
          </h2>
          <p
            style={{
              color: '#64748B',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            Anything else on your mind?
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 500))}
            placeholder="Write a quick thought..."
            className="textarea"
            maxLength={500}
            aria-label="Optional note about your mood"
          />
          <div
            style={{
              textAlign: 'right',
              fontSize: '0.75rem',
              color: '#64748B',
              marginTop: '0.25rem',
            }}
          >
            {note.length}/500
          </div>
        </motion.div>
      )}

      {/* Submit */}
      {selectedMood !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className="btn-primary"
            onClick={handleSubmit}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.05rem',
            }}
          >
            Save Check-in ✨
          </button>
        </motion.div>
      )}
    </div>
  );
}
