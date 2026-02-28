import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("font-bold tracking-tight", className)}>
      <span className="text-yey-yellow">YEY</span>
      <span className="text-yey-turquoise">CLUB</span>
    </Link>
  );
}
