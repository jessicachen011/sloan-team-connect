import React from "react";
import { cn } from "@/lib/utils";
import type { TeamStatus, TeamCardStatus } from "@/types";

interface StatusBadgeProps {
  status: TeamStatus | TeamCardStatus | string;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  Available: { label: "Available", className: "badge-available" },
  "In Conversations": { label: "Chatting", className: "badge-partial" },
  Committed: { label: "Committed", className: "badge-committed" },
  Open: { label: "Open", className: "badge-available" },
  Full: { label: "Full", className: "badge-full" },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "sm", className }) => {
  const config = statusConfig[status] ?? { label: status, className: "badge-committed" };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        config.className,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0" />
      {config.label}
    </span>
  );
};

export default StatusBadge;
