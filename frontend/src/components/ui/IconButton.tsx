"use client";

import { FC, ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "primary";
  ariaLabel?: string;
}

const IconButton: FC<Props> = ({ icon, size = "md", variant = "ghost", className, ariaLabel, ...rest }) => {
  const sizes: Record<string, string> = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-10 h-10",
  };
  const variants: Record<string, string> = {
    ghost: "bg-transparent hover:bg-slate-100 text-slate-700 dark:text-slate-200 dark:hover:bg-slate-700",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
  };

  return (
    <button
      aria-label={ariaLabel}
      className={clsx("inline-flex items-center justify-center rounded-md transition", sizes[size], variants[variant], className)}
      {...rest}
    >
      {icon}
    </button>
  );
};

export default IconButton;