export function useDebounce(callback: () => void, delay: number = 50) {
  let timerId: NodeJS.Timeout;

  return function () {
    clearTimeout(timerId);
    timerId = setTimeout(callback, delay);
  };
}