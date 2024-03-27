export function useDebounce<T>(callback: (...args: T[]) => void, delay: number = 50) {
  let timerId: NodeJS.Timeout;

  return function (...args: T[]) {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}