"use client"

import { useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Play } from "lucide-react"
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

type LightboxProps = {
  items: GalleryItem[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
  }),
}

export function Lightbox({
  items,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) {
  const item = items[currentIndex]
  const palette = GRADIENT_PALETTES[currentIndex % GRADIENT_PALETTES.length]

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  if (!item) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        />

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
          {currentIndex + 1} / {items.length}
        </div>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onPrev()
              }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        <div
          className="relative z-10 flex max-h-[80vh] w-full max-w-4xl flex-col items-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={item.id}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full"
            >
              {item.media_type === "video" ? (
                <div
                  className={cn(
                    "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br",
                    palette
                  )}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <Play className="ml-1 h-10 w-10 fill-white text-white" />
                  </div>
                </div>
              ) : (
                <div
                  className={cn(
                    "aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br",
                    palette
                  )}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {item.caption && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-center text-lg font-medium text-white/90"
            >
              {item.caption}
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
