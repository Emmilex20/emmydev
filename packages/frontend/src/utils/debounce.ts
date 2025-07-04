/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
// packages/frontend/src/utils/debounce.ts

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @template TFunc The type of the function to debounce.
 * @param {TFunc} func The function to debounce.
 * @param {number} wait The number of milliseconds to wait.
 * @returns {(this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>) => void} Returns the new debounced function.
 */
export function debounce<TFunc extends (...args: any[]) => any>( // Still needs `any[]` here for the generic constraint
  func: TFunc,
  wait: number
): (this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  // No need for lastArgs and lastThis as class/closure scope will handle it

  // We define the arguments and 'this' context directly on the returned function
  const debounced = function (this: ThisParameterType<TFunc>, ...args: Parameters<TFunc>): void {
    const context = this; // Capture 'this' here if needed within 'later'
    // This 'context' aliasing is generally allowed when capturing 'this'
    // from the outer function for use in an inner function (closure).
    // The rule targets direct assignment like `let self = this;` at the top level
    // or when it leads to confusing scope.

    const later = () => {
      timeout = null;
      // Use the captured 'context' and 'args' from the debounced function's call
      func.apply(context, args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };

  return debounced;
}