"use client";

import React from "react";
import clsx from "clsx";

type Variant = "default" | "elevated" | "outline" | "ghost";

type CardProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: Variant;
} & React.HTMLAttributes<HTMLDivElement>;

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "default",
  ...rest
}) => {
  const base =
    "rounded-xl p-4 transition-colors duration-200 bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100";

  const variants: Record<Variant, string> = {
    default:
      "border border-slate-200 dark:border-slate-700 shadow-sm",
    elevated:
      "shadow-lg border border-transparent hover:shadow-xl",
    outline:
      "border-2 border-slate-300 dark:border-slate-600 bg-transparent",
    ghost:
      "bg-transparent border border-transparent shadow-none",
  };

  return (
    <div
      className={clsx(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({
  children,
  className,
  ...rest
}) => (
  <div className={clsx("pb-3", className)} {...rest}>
    {children}
  </div>
);

export const CardContent: React.FC<CardProps> = ({
  children,
  className,
  ...rest
}) => (
  <div className={clsx("py-2 space-y-2", className)} {...rest}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({
  children,
  className,
  ...rest
}) => (
  <div
    className={clsx(
      "flex items-center justify-between pt-4 text-sm text-slate-500 dark:text-slate-400",
      className
    )}
    {...rest}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <h3 className={clsx("text-xl font-semibold tracking-tight", className)}>
    {children}
  </h3>
);

export default Card;
