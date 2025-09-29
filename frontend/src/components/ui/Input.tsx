"use client";

import { FC, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: FC<Props> = ({ label, className, ...rest }) => {
  return (
    <label className={clsx("flex flex-col text-sm", className)}>
      {label && <span className="mb-1 text-xs font-medium text-slate-700 dark:text-slate-200">{label}</span>}
      <input
        className="px-3 py-2 border rounded-md bg-white text-slate-800 border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
        {...rest}
      />
    </label>
  );
};

export default Input;