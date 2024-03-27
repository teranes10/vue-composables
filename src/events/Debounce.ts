export function useDebounce<T extends (...args: any[]) => void>(callback: T, delay: number = 50) {
  let timerId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timerId);
    timerId = setTimeout(() => callback(...args), delay);
  };
}