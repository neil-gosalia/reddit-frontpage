import { useEffect } from "react";

export function usePollingFetch(fetchFunction, delay = 5000) {
  useEffect(() => {
    let isMounted = true;
    fetchFunction(); // initial load
    const interval = setInterval(() => {
      fetchFunction(true); // silent mode
    }, delay);

    return () =>{ 
        isMounted=false;
        clearInterval(interval);
    };
  }, [fetchFunction, delay]);
}