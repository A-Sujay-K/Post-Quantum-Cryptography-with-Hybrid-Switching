import React, { useState, useEffect, useRef } from 'react';

const WORD1 = 'PQCHS';
const WORD2 = 'ENVIRONMENT';
const FULL_TITLE = `${WORD1} ${WORD2}`;
const ACCESSIBLE_LABEL = 'POST-QUANTUM CRYPTOGRAPHY HYBRID SWITCHING';

const NOISE_GLYPHS = ['▒', '░', '█', '▓', '-', '_', '/', '\\', '*', '+', '=', '%'];

/**
 * TitleWipe
 * Modeled on yannickgregoire.nl (Animation 1 & Reference Frames 1-2):
 * - Dot-matrix typography (Doto)
 * - Two words ("PQCHS ENVIRONMENT") with a wide gap
 * - Edge-to-edge layout, bleeding slightly past the right edge on desktop
 * - Wraps onto two lines on mobile
 * - Accessible h1 label: "POST-QUANTUM CRYPTOGRAPHY HYBRID SWITCHING"
 * - Left-to-right ASCII noise wave wipe on initial load (~1.2s)
 */
export default function TitleWipe({ className = '' }) {
  // Start with noise characters for initial load state
  const [displayChars, setDisplayChars] = useState(() =>
    FULL_TITLE.split('').map((char) =>
      char === ' ' ? ' ' : NOISE_GLYPHS[Math.floor(Math.random() * NOISE_GLYPHS.length)]
    )
  );
  const [isResolved, setIsResolved] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayChars(FULL_TITLE.split(''));
      setIsResolved(true);
      return;
    }

    const startTime = performance.now();
    const duration = 1200; // 1.2s per specification
    const length = FULL_TITLE.length;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Leading wave position across the string
      const wipeIndex = Math.floor(progress * (length + 4));

      const updated = FULL_TITLE.split('').map((char, index) => {
        if (char === ' ') return ' ';

        if (index < wipeIndex - 2) {
          // Resolved to final letter
          return char;
        } else if (index <= wipeIndex + 2) {
          // In the noise wave zone
          return NOISE_GLYPHS[Math.floor(Math.random() * NOISE_GLYPHS.length)];
        } else {
          // Waiting to be wiped - random subtle noise
          return NOISE_GLYPHS[Math.floor(Math.random() * 4)];
        }
      });

      setDisplayChars(updated);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayChars(FULL_TITLE.split(''));
        setIsResolved(true);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const word1Chars = displayChars.slice(0, WORD1.length);
  const word2Chars = displayChars.slice(WORD1.length + 1);

  return (
    <h1
      className={`font-doto font-black uppercase select-none tracking-tight leading-[0.85] text-[var(--text-primary)] w-full overflow-visible ${className}`}
      aria-label={ACCESSIBLE_LABEL}
    >
      <span
        aria-hidden="true"
        className="w-full flex flex-col md:flex-row md:items-baseline md:justify-between gap-y-2 md:gap-y-0 text-[clamp(2.5rem,8.4vw,11.2rem)] md:w-[calc(100%+2vw)] md:-mr-[2vw]"
      >
        {/* Word 1: PQCHS (Pinned Left) */}
        <span className="inline-flex tracking-[-0.04em] whitespace-nowrap">
          {word1Chars.map((ch, i) => (
            <span key={i} className="inline-block transition-colors duration-75">
              {ch}
            </span>
          ))}
        </span>

        {/* Word 2: ENVIRONMENT (Pinned Right, Bleeds slightly past right edge) */}
        <span className="inline-flex tracking-[-0.04em] whitespace-nowrap">
          {word2Chars.map((ch, i) => (
            <span key={i} className="inline-block transition-colors duration-75">
              {ch}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}
