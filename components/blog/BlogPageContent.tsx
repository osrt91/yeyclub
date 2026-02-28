"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogCard, BlogSearch } from "@/components/blog";
import type { BlogPost } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.25, 0.46, 0.45, 0.94] },
  },
} as const;

function filterPosts(
  posts: BlogPost[],
  searchQuery: string,
  selectedCategory: string
): BlogPost[] {
  const q = searchQuery.trim().toLowerCase();
  const bySearch = q
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.excerpt?.toLowerCase().includes(q) ?? false)
      )
    : posts;
  if (selectedCategory === "Tümü") return bySearch;
  return bySearch.filter((p) => p.category === selectedCategory);
}

type Props = {
  posts: BlogPost[];
};

export function BlogPageContent({ posts }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const filteredPosts = useMemo(
    () => filterPosts(posts, searchQuery, selectedCategory),
    [posts, searchQuery, selectedCategory]
  );

  const [featuredPost, ...gridPosts] = filteredPosts;

  return (
    <>
      <div className="mb-12">
        <BlogSearch
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSearch={setSearchQuery}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <AnimatePresence mode="wait">
        {filteredPosts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-foreground/20 py-20 text-center"
          >
            <p className="yey-text-muted text-lg">Sonuç bulunamadı.</p>
            <p className="mt-1 text-sm text-foreground/50">
              Farklı bir arama terimi veya kategori deneyin.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            {featuredPost && (
              <motion.div variants={cardVariants}>
                <BlogCard post={featuredPost} featured />
              </motion.div>
            )}

            {gridPosts.length > 0 && (
              <motion.div
                variants={containerVariants}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {gridPosts.map((post) => (
                  <motion.div key={post.id} variants={cardVariants}>
                    <BlogCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
