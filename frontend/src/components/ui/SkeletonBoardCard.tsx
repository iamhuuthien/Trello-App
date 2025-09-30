"use client";

import React, { FC } from "react";
import clsx from "clsx";

interface SkeletonBoardCardProps {
  withTitle?: boolean;
  lines?: number;
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl";
}

const SkeletonBoardCard: FC<SkeletonBoardCardProps> = ({
  withTitle = true,
  lines = 2,
  className = "",
  rounded = "md",
}) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-white/5 p-4 shadow-sm dark:bg-slate-800",
        {
          "rounded-sm": rounded === "sm",
          "rounded-md": rounded === "md",
          "rounded-lg": rounded === "lg",
          "rounded-xl": rounded === "xl",
        },
        className
      )}
    >
      {withTitle && (
        <div className="h-6 w-3/4 rounded bg-gradient-to-r from-slate-200/50 via-slate-300/60 to-slate-200/50 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 mb-3"></div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 w-full max-w-[70%] mb-2 rounded bg-gradient-to-r from-slate-200/50 via-slate-300/60 to-slate-200/50 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"
        ></div>
      ))}
    </div>
  );
};

export default SkeletonBoardCard;
