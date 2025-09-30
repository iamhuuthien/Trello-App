"use client";

import React, { FC, ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "primary";
  ariaLabel?: string;
}

const IconButton: FC<Props> = ({ icon, size = "md", variant = "ghost", className = "", ariaLabel, ...rest }) => {
  const sizes: Record<string, string> = { sm: "p-1", md: "p-2", lg: "p-3" };
  const variants: Record<string, string> = {
    ghost: "bg-transparent hover:bg-slate-100",
    primary: "bg-sky-600 text-white hover:bg-sky-700",
  };
  return (
    <button
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center rounded ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
};

export default IconButton;