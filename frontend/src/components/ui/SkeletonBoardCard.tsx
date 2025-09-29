"use client";

import React, { FC } from "react";

const SkeletonBoardCard: FC = () => {
  return (
    <div className="animate-pulse bg-white/5 rounded-md p-4 shadow-sm dark:bg-slate-800">
      <div className="h-6 w-3/4 bg-slate-200/60 rounded mb-3 dark:bg-slate-700"></div>
      <div className="h-3 w-1/2 bg-slate-200/50 rounded dark:bg-slate-700"></div>
    </div>
  );
};

export default SkeletonBoardCard;