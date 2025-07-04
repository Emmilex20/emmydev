/* eslint-disable @typescript-eslint/no-explicit-any */
// packages/frontend/src/utils/helpers.ts

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @template TFunc The type of the function to debounce.
 * @param {TFunc} func The function to debounce.
 * @param {number} wait The number of milliseconds to wait.
 * @returns {(this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>) => void} Returns the new debounced function.
 */
export function debounce<TFunc extends (...args: any[]) => any>( // Add TFunc generic constraint
  func: TFunc,
  wait: number
): (this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  // Define the debounced function. Explicitly type 'this' for this function.
  const debounced = function (this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>): void {
    // Capture 'this' and 'args' from the current invocation's context.
    // This 'context' variable is typically allowed by no-this-alias
    // because it's a necessary local capture for a closure.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this; 

    const later = () => {
      timeout = null;
      // Use the captured 'context' and 'args'
      func.apply(context, args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };

  return debounced;
}

// You can add other helper functions here if needed.
// For example:
// export function throttle<TFunc extends (...args: any[]) => any>(func: TFunc, wait: number) { /* ... */ }
// export function formatDate(date: Date): string { /* ... */ }