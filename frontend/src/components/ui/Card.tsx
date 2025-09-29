"use client";

import { FC, HTMLAttributes } from "react";
import clsx from "clsx";

const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...rest }) => {
  return (
    <div
      className={clsx(
        "rounded-md p-4 shadow-sm border",
        "bg-white text-slate-800 border-slate-200",
        "dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;