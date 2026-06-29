import { useEffect, useRef } from "react";

const useAutoRefresh = ({
  callback,
  enabled = true,
  intervalMs = 5000,
  refreshOnFocus = true,
}) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || !intervalMs) {
      return undefined;
    }

    const refresh = () => {
      if (document.visibilityState === "visible") {
        callbackRef.current?.();
      }
    };

    const intervalId = window.setInterval(refresh, intervalMs);

    const handleFocusRefresh = () => {
      if (refreshOnFocus) {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", handleFocusRefresh);
    window.addEventListener("focus", handleFocusRefresh);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleFocusRefresh);
      window.removeEventListener("focus", handleFocusRefresh);
    };
  }, [enabled, intervalMs, refreshOnFocus]);
};

export default useAutoRefresh;
