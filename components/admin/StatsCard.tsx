import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type StatsCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  trend?: string;
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  yellow: {
    bg: "bg-yey-yellow/10",
    text: "text-yey-yellow",
    border: "border-yey-yellow/20",
  },
  turquoise: {
    bg: "bg-yey-turquoise/10",
    text: "text-yey-turquoise",
    border: "border-yey-turquoise/20",
  },
  blue: {
    bg: "bg-yey-blue/10",
    text: "text-yey-blue",
    border: "border-yey-blue/20",
  },
  red: {
    bg: "bg-yey-red/10",
    text: "text-yey-red",
    border: "border-yey-red/20",
  },
};

export function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  const colors = colorMap[color] ?? colorMap.yellow;

  return (
    <div
      className={cn(
        "rounded-xl border bg-background/80 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg",
        colors.border
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="yey-text-muted text-sm font-medium">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {value.toLocaleString("tr-TR")}
          </p>
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", colors.text)}>
              {trend}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-3", colors.bg)}>
          <div className={colors.text}>{icon}</div>
        </div>
      </div>
    </div>
  );
}
