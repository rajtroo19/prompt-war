'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { saveExerciseCompletion } from '@/lib/storage';

interface ExerciseStep {
  phase: string;
  duration: number;
  instruction: string;
}

interface BreathingExerciseProps {
  id: string;
  name: string;
  steps: ExerciseStep[];
  cycles: number;
  color: string;
  onComplete?: () => void;
}

export function BreathingExercise({
  id,
  name,
  steps,
  cycles,
  color,
  onComplete,
}: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeLeft, setTimeLeft] = useState(steps[0]?.duration ?? 0);
  const [isComplete, setIsComplete] = useState(false);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentStep = steps[currentStepIndex];

  const reset = useCallback(() => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setCurrentCycle(0);
    setTimeLeft(steps[0]?.duration ?? 0);
    setIsComplete(false);
    setTotalElapsed(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [steps]);

  useEffect(() => {
    if (isActive && !isComplete) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next step
            const nextStepIndex = currentStepIndex + 1;
            if (nextStepIndex >= steps.length) {
              // End of cycle
              const nextCycle = currentCycle + 1;
              if (nextCycle >= cycles) {
                // Exercise complete
                setIsActive(false);
                setIsComplete(true);
                saveExerciseCompletion(id, totalElapsed);
                onComplete?.();
                return 0;
              }
              setCurrentCycle(nextCycle);
              setCurrentStepIndex(0);
              return steps[0].duration;
            }
            setCurrentStepIndex(nextStepIndex);
            return steps[nextStepIndex].duration;
          }
          return prev - 1;
        });
        setTotalElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, isComplete, currentStepIndex, currentCycle, steps, cycles, id, totalElapsed, onComplete]);

  const getScale = () => {
    if (!isActive) return 0.6;
    const phase = currentStep?.phase?.toLowerCase() ?? '';
    if (phase.includes('inhale') || phase.includes('in')) return 1;
    if (phase.includes('exhale') || phase.includes('out')) return 0.6;
    return 0.8;
  };

  const getOpacity = () => {
    if (!isActive) return 0.4;
    return 0.7 + (timeLeft / (currentStep?.duration ?? 1)) * 0.3;
  };

  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      {/* Breathing Circle */}
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          animate={{
            scale: getScale() * 1.1,
            opacity: getOpacity() * 0.3,
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}30, transparent)`,
          }}
        />

        {/* Main circle */}
        <motion.div
          animate={{
            scale: getScale(),
            opacity: getOpacity(),
          }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="breathing-circle"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${color}40, ${color}10)`,
            border: `2px solid ${color}60`,
            flexDirection: 'column',
          }}
        >
          {isComplete ? (
            <CheckCircle2 size={48} style={{ color }} />
          ) : (
            <>
              <span style={{ fontSize: '2rem', fontWeight: 700, color }}>
                {timeLeft}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.25rem' }}>
                {isActive ? currentStep?.phase : 'Ready'}
              </span>
            </>
          )}
        </motion.div>
      </div>

      {/* Instruction */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentStepIndex + '-' + currentCycle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            color: '#94A3B8',
            fontSize: '0.9rem',
            minHeight: '3rem',
            maxWidth: '300px',
            lineHeight: 1.5,
          }}
        >
          {isComplete
            ? '✨ Great job! You completed the exercise.'
            : isActive
            ? currentStep?.instruction
            : `${name} — ${cycles} cycle${cycles > 1 ? 's' : ''}`}
        </motion.p>
      </AnimatePresence>

      {/* Progress */}
      {isActive && !isComplete && (
        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
          Cycle {currentCycle + 1} of {cycles} · Step {currentStepIndex + 1} of{' '}
          {steps.length}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {!isComplete && (
          <button
            className="btn-primary"
            onClick={() => setIsActive(!isActive)}
            aria-label={isActive ? 'Pause exercise' : 'Start exercise'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            {isActive ? 'Pause' : 'Start'}
          </button>
        )}
        <button
          className="btn-secondary"
          onClick={reset}
          aria-label="Reset exercise"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RotateCcw size={18} />
          Reset
        </button>
      </div>
    </div>
  );
}
