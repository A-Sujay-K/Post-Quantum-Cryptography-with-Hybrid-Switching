import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'dark',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'system';
    return localStorage.getItem('pqc-theme') || 'system';
  });

  const getSystemTheme = useCallback(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }, []);

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  // Apply theme to document element
  const applyTheme = useCallback((targetTheme) => {
    const root = document.documentElement;
    root.dataset.theme = targetTheme;
    root.style.colorScheme = targetTheme;

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', targetTheme === 'dark' ? '#1a1410' : '#f0e8dc');
    }
  }, []);

  // Update theme with optional circular view-transition reveal
  const setTheme = useCallback((newTheme, event = null) => {
    const nextResolved = newTheme === 'system' ? getSystemTheme() : newTheme;

    const performUpdate = () => {
      setThemeState(newTheme);
      localStorage.setItem('pqc-theme', newTheme);
      applyTheme(nextResolved);
    };

    // Check if View Transitions API is supported and not prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (
      !prefersReducedMotion &&
      document.startViewTransition &&
      event &&
      event.clientX !== undefined
    ) {
      const x = event.clientX;
      const y = event.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        performUpdate();
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
          {
            clipPath: clipPath,
          },
          {
            duration: 450,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      }).catch(() => {
        performUpdate();
      });
    } else {
      performUpdate();
    }
  }, [applyTheme, getSystemTheme]);

  const toggleTheme = useCallback((event) => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next, event);
  }, [resolvedTheme, setTheme]);

  // Initial sync & system preference listener
  useEffect(() => {
    applyTheme(resolvedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      if (theme === 'system') {
        const sys = mediaQuery.matches ? 'light' : 'dark';
        applyTheme(sys);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Sync state if data-theme attribute on <html> is altered externally
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const currentAttr = document.documentElement.dataset.theme;
          if (currentAttr && (currentAttr === 'dark' || currentAttr === 'light') && currentAttr !== resolvedTheme) {
            setThemeState(currentAttr);
          }
        }
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, [theme, resolvedTheme, applyTheme]);

  // Lazy preload inactive background
  useEffect(() => {
    const inactive = resolvedTheme === 'dark' ? 'light' : 'dark';
    const timer = setTimeout(() => {
      const img = new Image();
      img.src = `/backgrounds/${inactive}.jpg`;
    }, 1500);
    return () => clearTimeout(timer);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
