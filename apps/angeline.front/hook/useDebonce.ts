import { useCallback, useEffect, useRef } from "react";

const useDebounce = <Args extends unknown[]>(
  cb: (...args: Args) => void,
  delay: number,
) => {
  const callbackRef = useRef(cb);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = cb;
  }, [cb]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const handler = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
      timeoutRef.current = handler;

      return () => {
        clearTimeout(handler);
      };
    },
    [delay],
  );
};

export default useDebounce;
