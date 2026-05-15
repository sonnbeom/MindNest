"use client";

import { useEffect, useState } from "react";

interface StreamingTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function StreamingText({
  text,
  speed = 40,
  className,
  onComplete,
}: StreamingTextProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
  }, [text]);

  useEffect(() => {
    if (count >= text.length) {
      onComplete?.();
      return;
    }
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [count, text, speed, onComplete]);

  const isDone = count >= text.length;

  return (
    <span className={className}>
      {text.slice(0, count)}
      {!isDone && (
        <span className="animate-pulse" style={{ color: "var(--primary)" }}>
          |
        </span>
      )}
    </span>
  );
}
