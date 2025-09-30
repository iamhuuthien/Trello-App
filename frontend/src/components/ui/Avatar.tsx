"use client";

import { FC } from "react";
import clsx from "clsx";

interface Props {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const Avatar: FC<Props> = ({ src, name, size = "md" }) => {
  const sizes: Record<string, string> = {
    sm: "w-7 h-7 text-sm",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} className={clsx("rounded-full object-cover", sizes[size])} />
  ) : (
    <div
      className={clsx(
        "rounded-full inline-flex items-center justify-center font-semibold",
        "bg-slate-100 text-slate-700",
        "dark:bg-slate-700 dark:text-slate-100",
        sizes[size]
      )}
    >
      {initials || "?"}
    </div>
  );
};

export default Avatar;