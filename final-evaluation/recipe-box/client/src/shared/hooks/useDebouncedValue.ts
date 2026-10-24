import { useState, useEffect, useRef } from 'react';

// 考点: custom hook with useRef for cleanup
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // 考点: useRef to store timeout ID
  const timeoutRef = useRef<number | null>(null);

  // 考点: useEffect with cleanup function
  useEffect(() => {
    if (timeoutRef.current !== null) {
      // 考点: clearing previous timeout
      clearTimeout(timeoutRef.current);
    }

    // 考点: setTimeout for debouncing
    timeoutRef.current = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // 考点: cleanup function to prevent memory leaks
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delayMs]);

  return debouncedValue;
}
