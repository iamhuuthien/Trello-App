"use client";

import { FC, HTMLAttributes } from "react";
import clsx from "clsx";

const Card: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...rest }) => {
  return (
    <div className={clsx("card shadow-sm", className)} {...rest}>
      {children}
    </div>
  );
};

export default Card;