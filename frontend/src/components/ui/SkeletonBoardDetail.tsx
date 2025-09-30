"use client";

import React, { FC } from "react";
import clsx from "clsx";

interface SkeletonBoardDetailProps {
  columns?: number;
  cardsPerCol?: number;
  className?: string;
  rounded?: "sm" | "md" | "lg";
}

const SkeletonBoardDetail: FC<SkeletonBoardDetailProps> = ({
  columns = 3,
  cardsPerCol = 3,
  className = "",
  rounded = "md",
}) => {
  return (
    <div
      className={clsx(
        "grid grid-cols-1 sm:grid-cols-3 gap-4",
        className
      )}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            "p-4 space-y-3 animate-pulse bg-white/5 dark:bg-slate-800",
            {
              "rounded-sm": rounded === "sm",
              "rounded-md": rounded === "md",
              "rounded-lg": rounded === "lg",
            }
          )}
        >
          {/* Column Title */}
          <div className="h-6 w-2/3 rounded bg-gradient-to-r from-slate-200/50 via-slate-300/60 to-slate-200/50 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>

          {/* Cards */}
          <div className="space-y-3">
            {Array.from({ length: cardsPerCol }).map((_, j) => (
              <div
                key={j}
                className="h-14 rounded bg-gradient-to-r from-slate-200/50 via-slate-300/60 to-slate-200/50 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonBoardDetail;
