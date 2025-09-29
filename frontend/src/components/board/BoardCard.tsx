"use client";

import { FC } from "react";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import { LayoutDashboard } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  members?: { name: string; src?: string }[];
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const BoardCard: FC<Props> = ({ title, description, members = [], onClick, onEdit, onDelete }) => {
  return (
    <Card className="p-4 cursor-pointer hover:shadow-md relative" onClick={onClick}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold">{title}</h4>
          </div>
          {description && <p className="text-sm text-slate-500 mt-2">{description}</p>}
        </div>

        <div className="flex flex-col gap-2">
          {onEdit && <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="text-xs text-blue-600">Edit</button>}
          {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-xs text-red-600">Delete</button>}
        </div>
      </div>

      <div className="flex -space-x-2 mt-3">
        {members.slice(0, 4).map((m, i) => (
          <div key={i} title={m.name} className="border-2 border-white rounded-full">
            <Avatar name={m.name} src={m.src} size="sm" />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BoardCard;