import React, { useState, useEffect, useRef } from 'react';

/**
 * AnimatedNumber Component
 * Smoothly interpolates numeric changes using requestAnimationFrame and easeOutCubic curve.
 * Automatically respects prefers-reduced-motion.
 */
export default function AnimatedNumber({
  value = 0,
  duration = 500,
  formatter = (n) => Math.round(n).toLocaleString(),
  className = '',
}) {
  const targetVal = Number(value) || 0;
  const [displayValue, setDisplayValue] = useState(targetVal);
  const prevValueRef = useRef(targetVal);
  const animFrameRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || duration <= 0) {
      setDisplayValue(targetVal);
      prevValueRef.current = targetVal;
      return;
    }

    const startVal = prevValueRef.current;
    const endVal = targetVal;
    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic: 1 - pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (endVal - startVal) * easeProgress;

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endVal);
        prevValueRef.current = endVal;
      }
    };

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [targetVal, duration]);

  return <span className={className}>{formatter(displayValue)}</span>;
}
