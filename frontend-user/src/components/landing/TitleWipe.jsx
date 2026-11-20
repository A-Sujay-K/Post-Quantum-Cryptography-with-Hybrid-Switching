import React, { useState, useEffect, useRef } from 'react';

const DESKTOP_LINES = ['ARE YOU READY FOR', 'THE QUANTUM FUTURE?'];
const MOBILE_LINES = ['ARE YOU', 'READY FOR', 'THE QUANTUM', 'FUTURE?'];
const FULL_SENTENCE = 'ARE YOU READY FOR THE QUANTUM FUTURE?';

const NOISE_GLYPHS = ['▒', '░', '█', '▓', '-', '_', '/', '\\', '*', '+', '=', '%'];

/**
 * TitleWipe
 * - Dot-matrix typography (Doto weight 900)
 * - Accessible h1 with exact sentence: "ARE YOU READY FOR THE QUANTUM FUTURE?"
 * - Desktop: TWO lines ("ARE YOU READY FOR" / "THE QUANTUM FUTURE?")
 *   Sized from advance width (0.60em) with font-size explicitly reduced by 5px per request.
 * - Mobile: FOUR lines ("ARE YOU" / "READY FOR" / "THE QUANTUM" / "FUTURE?")
 *   Sized with font-size reduced by 5px.
 * - Load wipe: Left-to-right ASCII noise wave resolving in ~1.2s, with staggered line starts.
 * - Reduced motion: final text displayed immediately.
 */
export default function TitleWipe({ className = '' }) {
  const containerRef = useRef(null);
  const [fontSize, setFontSize] = useState(null);
  const [mobFontSize, setMobFontSize] = useState(null);

  // Character state for desktop lines
  const [desktopChars, setDesktopChars] = useState(() =>
    DESKTOP_LINES.map((line) =>
      line.split('').map((char) =>
        char === ' ' ? ' ' : NOISE_GLYPHS[Math.floor(Math.random() * NOISE_GLYPHS.length)]
      )
    )
  );

  // Character state for mobile lines
  const [mobileChars, setMobileChars] = useState(() =>
    MOBILE_LINES.map((line) =>
      line.split('').map((char) =>
        char === ' ' ? ' ' : NOISE_GLYPHS[Math.floor(Math.random() * NOISE_GLYPHS.length)]
      )
    )
  );

  const [isResolved, setIsResolved] = useState(false);
  const frameRef = useRef(null);

  // Responsive font size calculation based on Doto 0.60em advance with -5px reduction
  useEffect(() => {
    const updateSizes = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      // Doto 900 advance = 0.60em
      // Desktop: 19 characters * 0.60 = 11.4em -> font size = (w / 11.4) - 5px
      // Mobile: 11 characters * 0.60 = 6.6em -> font size = (w / 6.6) - 5px
      if (w > 0) {
        setFontSize(Math.max(14, Math.round((w / 11.4) - 5)));
        setMobFontSize(Math.max(12, Math.round((w / 6.6) - 5)));
      }
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDesktopChars(DESKTOP_LINES.map((line) => line.split('')));
      setMobileChars(MOBILE_LINES.map((line) => line.split('')));
      setIsResolved(true);
      return;
    }

    const startTime = performance.now();
    const duration = 1200; // 1.2s per specification
    const desktopStagger = 120; // line 2 starts 120ms after line 1
    const mobileStagger = 100;

    const tick = (now) => {
      const elapsed = now - startTime;

      // 1. Update Desktop Lines
      const updatedDesktop = DESKTOP_LINES.map((line, lineIdx) => {
        const lineStart = lineIdx * desktopStagger;
        if (elapsed < lineStart) {
          return line.split('').map((char) =>
            char === ' ' ? ' ' : NOISE_GLYPHS[Math.floor(Math.random() * 4)]
          );
        }

        const lineElapsed = elapsed - lineStart;
        const progress = Math.min(1, lineElapsed / duration);
        const wipeIndex = Math.floor(progress * (line.length + 3));

        return line.split('').map((char, charIdx) => {
          if (char === ' ') return ' ';
          if (charIdx < wipeIndex - 2) {
            return char;
          } else if (charIdx <= wipeIndex + 2) {
            return NOISE_GLYPHS[Math.floor(Math.random() * NOISE_GLYPHS.length)];
          } else {
            return NOISE_GLYPHS[Math.floor(Math.random() * 4)];
          }
        });
      });

      // 2. Update Mobile Lines
      const updatedMobile = MOBILE_LINES.map((line, lineIdx) => {
        const lineStart = lineIdx * mobileStagger;
        if (elapsed < lineStart) {
          return line.split('').map((char) =>
            char === ' ' ? ' ' : NOISE_GLYPHS[Math.floor(Math.random() * 4)]
          );
        }

        const lineElapsed = elapsed - lineStart;
        const progress = Math.min(1, lineElapsed / duration);
        const wipeIndex = Math.floor(progress * (line.length + 3));

        return line.split('').map((char, charIdx) => {
          if (char === ' ') return ' ';
          if (charIdx < wipeIndex - 2) {
            return char;
          } else if (charIdx <= wipeIndex + 2) {
            return NOISE_GLYPHS[Math.floor(Math.random() * NOISE_GLYPHS.length)];
          } else {
            return NOISE_GLYPHS[Math.floor(Math.random() * 4)];
          }
        });
      });

      setDesktopChars(updatedDesktop);
      setMobileChars(updatedMobile);

      const maxDuration = duration + Math.max(desktopStagger, mobileStagger * 3);
      if (elapsed < maxDuration) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDesktopChars(DESKTOP_LINES.map((line) => line.split('')));
        setMobileChars(MOBILE_LINES.map((line) => line.split('')));
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
      ref={containerRef}
      className={`font-doto font-black uppercase select-none tracking-tight leading-[0.88] text-[var(--text-primary)] w-full overflow-hidden ${className}`}
      aria-label={FULL_SENTENCE}
    >
      {/* ── Desktop Presentation (>= 768px): 2 Lines (Reduced by 5px) ──────── */}
      <span
        aria-hidden="true"
        className="hidden md:flex flex-col items-start w-full whitespace-pre"
        style={{
          fontSize: fontSize ? `${fontSize}px` : 'calc(clamp(3.8rem, calc((100vw - 5rem) / 11.4), 10.1rem) - 5px)',
        }}
      >
        {desktopChars.map((lineChars, lineIdx) => (
          <span key={lineIdx} className="block w-fit whitespace-pre">
            {lineChars.map((ch, charIdx) => (
              <span
                key={charIdx}
                className="inline-block transition-colors duration-75"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </span>
        ))}
      </span>

      {/* ── Mobile Presentation (< 768px): 4 Lines (Reduced by 5px) ────────── */}
      <span
        aria-hidden="true"
        className="flex md:hidden flex-col items-start w-full whitespace-pre"
        style={{
          fontSize: mobFontSize ? `${mobFontSize}px` : 'calc(clamp(2.5rem, calc((100vw - 3rem) / 6.6), 4.2rem) - 5px)',
        }}
      >
        {mobileChars.map((lineChars, lineIdx) => (
          <span key={lineIdx} className="block w-fit whitespace-pre">
            {lineChars.map((ch, charIdx) => (
              <span
                key={charIdx}
                className="inline-block transition-colors duration-75"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </span>
        ))}
      </span>
    </h1>
  );
}
