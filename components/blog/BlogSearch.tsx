"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Tümü", "Topluluk", "Etkinlik", "Gönüllülük", "Duyuru"] as const;

type BlogSearchProps = {
  searchQuery: string;
  selectedCategory: string;
  onSearch: (query: string) => void;
  onCategoryChange: (category: string) => void;
};

export function BlogSearch({
  searchQuery,
  selectedCategory,
  onSearch,
  onCategoryChange,
}: BlogSearchProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
        <input
          type="text"
          placeholder="Blog ara..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className={cn(
            "w-full rounded-xl border border-border bg-card py-3 pl-12 pr-10",
            "text-foreground placeholder:text-foreground/40",
            "backdrop-blur-sm transition-all duration-200",
            "focus:border-yey-turquoise/50 focus:outline-none focus:ring-2 focus:ring-yey-turquoise/20"
          )}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              selectedCategory === cat
                ? "bg-yey-turquoise text-white shadow-md shadow-yey-turquoise/20"
                : "border border-border text-foreground/70 hover:border-yey-turquoise/30 hover:text-yey-turquoise"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
