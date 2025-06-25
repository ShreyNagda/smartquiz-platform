"use client";
import React, { useEffect, useState } from "react";

type QuizTimerProps = {
  timeLimit: number;
  onComplete: () => void;
};

export default function QuizTimer({ timeLimit, onComplete }: QuizTimerProps) {
  const [seconds, setSeconds] = useState(timeLimit * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete(); // Trigger when time finishes
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Clean up
  }, [onComplete]);

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")} : ${(seconds % 60).toString().padStart(2, "0")}`;
  };

  return <div className="text-center mt-2">{formatTime(seconds)}</div>;
}
