"use client";

import React, { FC } from "react";

const LoadingSpinner: FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => {
  const s = size;
  return (
    <svg
      className={`animate-spin text-slate-500 ${className}`}
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="opacity-75"
      />
    </svg>
  );
};

export default LoadingSpinner;