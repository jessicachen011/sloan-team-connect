import React from "react";
import { cn } from "@/lib/utils";

interface AvatarChipProps {
  initials: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
};

const colorMap = ["bg-primary", "bg-[hsl(220_60%_45%)]", "bg-[hsl(142_60%_35%)]", "bg-[hsl(35_90%_40%)]", "bg-[hsl(280_50%_45%)]"];

function hashString(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
  return Math.abs(hash);
}

const AvatarChip: React.FC<AvatarChipProps> = ({ initials, name = "", size = "md", className }) => {
  const color = colorMap[hashString(initials + name) % colorMap.length];
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-primary-foreground flex-shrink-0 select-none",
        sizeMap[size],
        color,
        className
      )}
    >
      {initials}
    </div>
  );
};

export default AvatarChip;
