import React, { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_CHARS = '▒░█▓/-+_\\*#%~=:01';

/**
 * ScrambleText
 * High-craft terminal text scramble animation.
 * Characters resolve left-to-right with randomized noise glyphs and staggering.
 * Supports hover, focus, tap-toggle (with outside click restore), and reserved monospace width.
 */
export default function ScrambleText({
  text,
  hoverText = null,
  delay = 0,
  duration = 600,
  scrambleChars = DEFAULT_CHARS,
  trigger = 'mount', // 'mount' | 'inView' | 'hover'
  reserveWidth = null, // number of ch units to reserve to prevent layout shift
  ariaLabel = null,
  className = '',
  onComplete = null,
  as: Component = 'span',
  ...props
}) {
  const [targetText, setTargetText] = useState(text);
  const [displayText, setDisplayText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Check prefers-reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const active = isHovered || isToggled;

  useEffect(() => {
    if (active && hoverText) {
      setTargetText(hoverText);
    } else {
      setTargetText(text);
    }
  }, [active, hoverText, text]);

  // Outside click listener to restore base text on touch tap
  useEffect(() => {
    if (!hoverText) return;
    const handleDocClick = (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target)) {
        setIsToggled(false);
      }
    };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, [hoverText]);

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
          result += chars[Math.floor(Math.random() * chars.length)];
          allSettled = false;
        } else if (elapsed < charSettleTime) {
          result += chars[Math.floor(Math.random() * chars.length)];
          allSettled = false;
        } else {
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

  // Initial mount / inView trigger
  useEffect(() => {
    if (trigger === 'hover') {
      setDisplayText(targetText);
      setHasTriggered(true);
      return;
    }

    if (trigger === 'mount') {
      const timer = setTimeout(() => {
        runScramble(targetText);
        setHasTriggered(true);
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

  // When active state changes (hover / focus / tap)
  useEffect(() => {
    if (!hasTriggered && trigger !== 'hover') return;
    if (active && hoverText) {
      runScramble(hoverText);
    } else if (!active && hoverText && displayText) {
      runScramble(text);
    }
  }, [active, hoverText, text, runScramble, hasTriggered, trigger]);

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

  const handleClick = (e) => {
    if (hoverText) {
      setIsToggled((prev) => !prev);
    }
  };

  const computedAriaLabel = ariaLabel || (hoverText ? `${text}. Detail: ${hoverText}` : text);

  return (
    <Component
      ref={elementRef}
      className={`select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--col-standard)] rounded-sm ${className}`}
      aria-label={computedAriaLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      tabIndex={hoverText ? 0 : undefined}
      role={hoverText ? 'button' : undefined}
      {...props}
    >
      <span
        aria-hidden="true"
        style={reserveWidth ? { display: 'inline-block', minWidth: `${reserveWidth}ch` } : undefined}
      >
        {displayText || targetText}
      </span>
    </Component>
  );
}
