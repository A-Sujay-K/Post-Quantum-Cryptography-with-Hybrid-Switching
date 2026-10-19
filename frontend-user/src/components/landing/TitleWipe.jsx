import React, { useState, useEffect, useRef } from 'react';

const TITLE = 'PQC SECURE COMM';
const NOISE_GLYPHS = ['▒', '░', '█', '▓', '-', '_', '/', '\\', '*', '+', '=', '%'];

/**
 * TitleWipe
 * Giant dot-matrix title that fills with ASCII noise upon initial load
 * and resolves left-to-right into clean dot-matrix letters over ~1.2s.
 */
export default function TitleWipe({ className = '' }) {
  const [displayChars, setDisplayChars] = useState(TITLE.split(''));
  const [isResolved, setIsResolved] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsResolved(true);
      return;
    }

    const startTime = performance.now();
    const duration = 1200; // 1.2s per specification
    const length = TITLE.length;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Leading wave position across the string
      const wipeIndex = Math.floor(progress * (length + 4));

      const updated = TITLE.split('').map((char, index) => {
        if (char === ' ') return ' ';

        if (index < wipeIndex - 2) {
          // Resolved to final letter
          return char;
        } else if (index <= wipeIndex + 2) {
          // In the noise wave zone
          return NOISE_GLYPHS[Math.floor(Math.random() * NOISE_GLYPHS.length)];
        } else {
          // Waiting to be wiped, initially noisy or blank
          return NOISE_GLYPHS[Math.floor(Math.random() * 4)];
        }
      });

      setDisplayChars(updated);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayChars(TITLE.split(''));
        setIsResolved(true);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <h1
      className={`font-doto font-black uppercase select-none tracking-tight leading-[0.9] text-[var(--text-primary)] ${className}`}
      aria-label={TITLE}
    >
      <span aria-hidden="true" className="inline-flex flex-wrap items-baseline gap-x-4 md:gap-x-8">
        <span className="inline-block whitespace-nowrap">
          {displayChars.slice(0, 3).map((ch, i) => (
            <span key={i} className="inline-block">{ch}</span>
          ))}
        </span>
        <span className="inline-block whitespace-nowrap">
          {displayChars.slice(4, 10).map((ch, i) => (
            <span key={i + 4} className="inline-block">{ch}</span>
          ))}
        </span>
        <span className="inline-block whitespace-nowrap">
          {displayChars.slice(11).map((ch, i) => (
            <span key={i + 11} className="inline-block">{ch}</span>
          ))}
        </span>
      </span>
    </h1>
  );
}
