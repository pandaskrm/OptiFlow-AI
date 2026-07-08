"use client";

import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  duration?: number;
};

export default function AnimatedCounter({
  value,
  duration = 600,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const start = displayValue;
    const end = value;

    if (start === end) return;

    const diff = end - start;
    const steps = Math.max(Math.abs(diff), 1);
    const stepTime = duration / steps;

    let current = start;

    const timer = setInterval(() => {
      current += diff > 0 ? 1 : -1;
      setDisplayValue(current);

      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{displayValue}</>;
}