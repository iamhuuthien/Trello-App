"use client";

import React, { FC } from "react";

const SkeletonBoardDetail: FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white/5 rounded-md p-4 space-y-3 animate-pulse dark:bg-slate-800">
          <div className="h-6 w-2/3 bg-slate-200/60 rounded dark:bg-slate-700"></div>
          <div className="space-y-3">
            {[0, 1, 2].map((j) => (
              <div key={j} className="h-14 bg-slate-200/50 rounded dark:bg-slate-700"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonBoardDetail;