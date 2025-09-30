import React from "react";
import Card, { CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/Card";
import { Calendar, Users } from "lucide-react";

interface BoardCardProps {
  title: string;
  description?: string;
  memberCount?: number;
  updatedAt?: string;
  onClick?: () => void;
}

export default function BoardCard({ title, description, memberCount = 0, updatedAt, onClick }: BoardCardProps) {
  return (
    <Card 
      className="cursor-pointer hover:border-blue-400 transition-colors" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle>{title || "Untitled Board"}</CardTitle>
      </CardHeader>
      <CardContent>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{memberCount}</span>
        </div>
        {updatedAt && (
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{new Date(updatedAt).toLocaleDateString()}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}