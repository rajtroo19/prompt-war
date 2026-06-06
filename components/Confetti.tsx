'use client';

import { useEffect, useState } from 'react';

const COLORS = ['#6EE7B7', '#FCD34D', '#F87171', '#818CF8', '#FB923C', '#EC4899', '#4ade80'];

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  delay: number;
  size: number;
}

export function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (active) {
      const newPieces: ConfettiPiece[] = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 1.5,
        size: 6 + Math.random() * 8,
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => setPieces([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
