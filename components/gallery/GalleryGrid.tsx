"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { GalleryItem } from "@/types"

const GRADIENT_PALETTES = [
  "from-yey-yellow/60 to-yey-turquoise/40",
  "from-yey-turquoise/50 to-yey-blue/60",
  "from-yey-blue/50 to-yey-red/40",
  "from-yey-red/40 to-yey-yellow/50",
  "from-yey-ice-blue/50 to-yey-turquoise/40",
  "from-yey-yellow/40 to-yey-red/30",
  "from-yey-turquoise/40 to-yey-yellow/50",
  "from-yey-blue/40 to-yey-ice-blue/50",
]

function seededHeight(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return 200 + Math.abs(hash % 200)
}

type GalleryGridProps = {
  items: GalleryItem[]
  onItemClick: (index: number) => void
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function GalleryGrid({ items, onItemClick }: GalleryGridProps) {
  const heights = useMemo(
    () => items.map((item) => seededHeight(item.id)),
    [items]
  )

  if (items.length === 0) return null

  return (
    <motion.div
      className="columns-2 gap-4 md:columns-3 lg:columns-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={items.map((i) => i.id).join(",")}
    >
      {items.map((item, index) => {
        const palette = GRADIENT_PALETTES[index % GRADIENT_PALETTES.length]
        const height = heights[index]

        return (
          <motion.button
            key={item.id}
            variants={itemVariants}
            onClick={() => onItemClick(index)}
            className="group relative mb-4 w-full cursor-pointer overflow-hidden rounded-2xl break-inside-avoid"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
          >
            <div
              className={cn("bg-gradient-to-br", palette)}
              style={{ height }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {item.media_type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 h-7 w-7 fill-white text-white" />
                </div>
              </div>
            )}

            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-left text-sm font-medium text-white drop-shadow-lg">
                  {item.caption}
                </p>
              </div>
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
