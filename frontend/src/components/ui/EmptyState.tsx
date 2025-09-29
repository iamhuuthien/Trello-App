"use client";

import { FC, ReactNode } from "react";
import { FolderKanban } from "lucide-react";
import Button from "./Button";

interface Props {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: { label: string; onClick?: () => void };
}

const EmptyState: FC<Props> = ({ title = "No items", description, icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-slate-600">
      <div className="p-4 bg-slate-100 rounded-md">
        {icon ?? <FolderKanban className="w-8 h-8 text-slate-400" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm">{description}</p>}
      {action && (
        <div>
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;