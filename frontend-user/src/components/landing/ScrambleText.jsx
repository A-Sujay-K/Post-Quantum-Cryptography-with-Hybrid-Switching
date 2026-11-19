import React, { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_CHARS = '▒░█▓/-+_\\*#%~=:01';

/**
 * ScrambleText
 * High-craft terminal text scramble animation.
 * Characters resolve left-to-right with randomized noise glyphs and staggering.
 */
export default function ScrambleText({
  text,
  hoverText = null,
  delay = 0,
  duration = 600,
  scrambleChars = DEFAULT_CHARS,
  trigger = 'mount', // 'mount' | 'inView' | 'hover'
  className = '',
  onComplete = null,
  as: Component = 'span',
  ...props
}) {
  const [targetText, setTargetText] = useState(text);
  const [displayText, setDisplayText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (isHovered && hoverText) {
      setTargetText(hoverText);
    } else {
      setTargetText(text);
    }
  }, [isHovered, hoverText, text]);

  const runScramble = useCallback((str) => {
    if (prefersReducedMotion) {
      setDisplayText(str);
      if (onComplete) onComplete();
      return;
    }

    const length = str.length;
    const startTime = performance.now();
    const chars = scrambleChars.split('');
    const charDelay = Math.max(15, Math.floor(duration / (length || 1)));

    const tick = (now) => {
      const elapsed = now - startTime;
      let result = '';
      let allSettled = true;

      for (let i = 0; i < length; i++) {
        if (str[i] === ' ') {
          result += ' ';
          continue;
        }

        const charStartTime = i * (charDelay * 0.7);
        const charSettleTime = charStartTime + charDelay * 1.5;

        if (elapsed < charStartTime) {
          // Still waiting to start scrambling or initial placeholder
          result += chars[Math.floor(Math.random() * chars.length)];
          allSettled = false;
        } else if (elapsed < charSettleTime) {
          // Currently scrambling
          result += chars[Math.floor(Math.random() * chars.length)];
          allSettled = false;
        } else {
          // Settled to target character
          result += str[i];
        }
      }

      setDisplayText(result);

      if (!allSettled) {
        animationFrameRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayText(str);
        if (onComplete) onComplete();
      }
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  }, [duration, scrambleChars, prefersReducedMotion, onComplete]);

  // Handle trigger logic
  useEffect(() => {
    if (trigger === 'hover') {
      setDisplayText(targetText);
      return;
    }

    if (trigger === 'mount') {
      const timer = setTimeout(() => {
        runScramble(targetText);
      }, delay);
      return () => {
        clearTimeout(timer);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }

    if (trigger === 'inView' && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasTriggered) {
            setHasTriggered(true);
            const timer = setTimeout(() => {
              runScramble(targetText);
            }, delay);
            return () => clearTimeout(timer);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(elementRef.current);
      return () => {
        observer.disconnect();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [targetText, trigger, delay, runScramble, hasTriggered]);

  // When hoverText switches targetText
  useEffect(() => {
    if (isHovered && hoverText) {
      runScramble(hoverText);
    } else if (!isHovered && hoverText && displayText) {
      runScramble(text);
    }
  }, [isHovered, hoverText, text, runScramble]);

  const handleMouseEnter = () => {
    if (hoverText) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverText) setIsHovered(false);
  };

  const handleFocus = () => {
    if (hoverText) setIsHovered(true);
  };

  const handleBlur = () => {
    if (hoverText) setIsHovered(false);
  };

  return (
    <Component
      ref={elementRef}
      className={className}
      aria-label={targetText}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={hoverText ? 0 : undefined}
      {...props}
    >
      <span aria-hidden="true">
        {displayText || targetText}
      </span>
    </Component>
  );
}
