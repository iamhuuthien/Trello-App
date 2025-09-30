"use client";

import React, { FC } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "white";
type Speed = "fast" | "normal" | "slow";

interface SpinnerProps {
  size?: number;
  className?: string;
  variant?: Variant;
  speed?: Speed;
  strokeWidth?: number;
}

const LoadingSpinner: FC<SpinnerProps> = ({
  size = 24,
  className = "",
  variant = "primary",
  speed = "normal",
  strokeWidth = 4,
}) => {
  const variants: Record<Variant, string> = {
    primary: "text-indigo-600",
    secondary: "text-slate-500",
    danger: "text-red-500",
    white: "text-white",
  };

  const speeds: Record<Speed, string> = {
    fast: "animate-spin",
    normal: "animate-spin-slow",
    slow: "animate-spin-slower",
  };

  return (
    <svg
      className={clsx(variants[variant], speeds[speed], className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.2"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 12a10 10 0 00-10-10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LoadingSpinner;
