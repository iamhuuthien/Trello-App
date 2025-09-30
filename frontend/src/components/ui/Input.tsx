"use client";

import React, { FC, InputHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "default" | "outline" | "filled";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  variant?: Variant;
}

const Input: FC<Props> = ({
  label,
  helperText,
  error = false,
  variant = "default",
  className = "",
  ...rest
}) => {
  const base =
    "w-full rounded-md px-3 py-2 text-sm transition focus:outline-none focus:ring-2";
  const variants: Record<Variant, string> = {
    default:
      "border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:ring-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700",
    outline:
      "border-2 border-slate-400 bg-transparent text-slate-900 placeholder:text-slate-400 focus:ring-indigo-500 dark:text-slate-100 dark:border-slate-600",
    filled:
      "border border-slate-200 bg-slate-100 text-slate-900 placeholder:text-slate-500 focus:ring-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700",
  };

  const errorClass = error
    ? "border-red-500 focus:ring-red-500 placeholder:text-red-400"
    : "";

  return (
    <label className="block text-sm">
      {label && (
        <div className="mb-1 font-medium text-slate-700 dark:text-slate-200">
          {label}
        </div>
      )}
      <input
        {...rest}
        className={clsx(base, variants[variant], errorClass, className)}
      />
      {helperText && (
        <p
          className={clsx(
            "mt-1 text-xs",
            error ? "text-red-500" : "text-slate-500 dark:text-slate-400"
          )}
        >
          {helperText}
        </p>
      )}
    </label>
  );
};

export default Input;
