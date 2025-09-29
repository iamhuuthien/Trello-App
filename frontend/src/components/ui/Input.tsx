"use client";

import { FC, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: FC<Props> = ({ label, className, ...rest }) => {
  return (
    <label className={clsx("flex flex-col text-slate-700 text-sm", className)}>
      {label && <span className="mb-1 text-xs font-medium">{label}</span>}
      <input
        className="px-3 py-2 border rounded-md bg-white text-slate-800 border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        {...rest}
      />
    </label>
  );
};

export default Input;