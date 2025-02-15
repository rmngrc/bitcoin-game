import { SECONDS_BETWEEN_GUESSES } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";

export const useCountdown = () => {
  const [countdown, setCountdown] = useState(-1);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setCountdown((time) => {
        return Math.max(0, time - 1);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [countdown]);

  const startCountdown = useCallback(() => setCountdown(SECONDS_BETWEEN_GUESSES), []);

  const resetCountdown = useCallback(() => setCountdown(-1), []);

  return { countdown, resetCountdown, startCountdown };
};
