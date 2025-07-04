// packages/frontend/src/hooks/useScrollDirection.tsx
import { useState, useEffect } from 'react';
import { debounce } from '../utils/debounce'; // Import the debounce utility

type ScrollDirection = 'up' | 'down' | 'initial';

interface UseScrollDirectionOptions {
  threshold?: number; // How many pixels to scroll before direction changes
  debounceDelay?: number; // Delay for debouncing scroll events
}

export const useScrollDirection = (options?: UseScrollDirectionOptions): ScrollDirection => {
  const { threshold = 0, debounceDelay = 100 } = options || {};

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('initial');
  const [lastScrollY, setLastScrollY] = useState(0); // Store previous scroll position

  useEffect(() => {
    // Handler for the scroll event
    const handleScroll = debounce(() => {
      const currentScrollY = window.scrollY;

      // Determine direction only if scroll position changes beyond a threshold
      if (Math.abs(currentScrollY - lastScrollY) < threshold) {
        return; // Not enough scroll to change direction
      }

      if (currentScrollY > lastScrollY && currentScrollY > 0) {
        // Scrolled down (and not at the very top)
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        // Scrolled up
        setScrollDirection('up');
      }

      setLastScrollY(currentScrollY); // Update last scroll position
    }, debounceDelay); // Debounce the scroll handler

    // Add and remove event listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, threshold, debounceDelay]); // Re-run effect if these dependencies change

  return scrollDirection;
};