import { useEffect } from "react";

export function usePollingFetch(fetchFunction, delay = 5000) {
  useEffect(() => {
    fetchFunction(); // initial load

    const interval = setInterval(() => {
      fetchFunction(true); // silent mode
    }, delay);

    return () => clearInterval(interval);
  }, [fetchFunction, delay]);
}