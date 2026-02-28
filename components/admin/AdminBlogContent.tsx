"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  togglePublishPost,
} from "@/lib/actions/blog";
import type { BlogPost } from "@/types";
import type { BlogEditorSubmitData } from "@/components/admin/BlogEditor";

const BlogEditor = dynamic(
  () => import("@/components/admin/BlogEditor").then((m) => m.BlogEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-yey-turquoise border-t-transparent" />
      </div>
    ),
  }
);

type ViewMode = "list" | "editor";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
} as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const categoryToLabel: Record<string, string> = {
  topluluk: "Topluluk",
  etkinlik: "Etkinlik",
  gonulluluk: "Gönüllülük",
  duyuru: "Duyuru",
};

const categoryToSlug: Record<string, string> = {
  Topluluk: "topluluk",
  Etkinlik: "etkinlik",
  Gönüllülük: "gonulluluk",
  Duyuru: "duyuru",
};

type Props = {
  initialPosts: BlogPost[];
};

export function AdminBlogContent({ initialPosts }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.category ?? "").toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.published).length;
    const draft = total - published;
    return { total, published, draft };
  }, [posts]);

  const handleCreateNew = () => {
    setEditingPost(null);
    setViewMode("editor");
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setViewMode("editor");
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`"${post.title}" yazısını silmek istediğinize emin misiniz?`))
      return;
    const result = await deleteBlogPost(post.id);
    if (result.success) {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success("Yazı silindi");
    } else {
      toast.error(result.error);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const result = await togglePublishPost(post.id, !post.published);
    if (result.success) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                published: !p.published,
                published_at: p.published ? null : new Date().toISOString(),
              }
            : p
        )
      );
      toast.success(
        post.published ? "Yazı taslağa alındı" : "Yazı yayınlandı"
      );
    } else {
      toast.error(result.error);
    }
  };

  const handleSubmit = async (data: BlogEditorSubmitData) => {
    setIsSubmitting(true);

    const category = categoryToLabel[data.category] ?? data.category;

    if (editingPost) {
      const result = await updateBlogPost({
        id: editingPost.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category,
        cover_image: data.cover_image,
        published: data.published,
      });

      if (result.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === editingPost.id ? { ...p, ...result.data } : p
          )
        );
        toast.success("Yazı güncellendi");
      } else {
        toast.error(result.error);
      }
    } else {
      const result = await createBlogPost({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category,
        cover_image: data.cover_image,
        published: data.published,
      });

      if (result.success) {
        setPosts((prev) => [result.data, ...prev]);
        toast.success(
          data.published ? "Yazı yayınlandı" : "Taslak kaydedildi"
        );
      } else {
        toast.error(result.error);
      }
    }

    setIsSubmitting(false);
    setViewMode("list");
    setEditingPost(null);
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingPost(null);
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {viewMode === "list" ? (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="yey-heading flex items-center gap-2 text-3xl">
                  <FileText className="h-8 w-8 text-yey-turquoise" />
                  Blog Yönetimi
                </h1>
                <p className="yey-text-muted mt-1">
                  Blog yazılarını oluşturun ve düzenleyin.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCreateNew}
                className="yey-btn-primary"
              >
                <Plus className="mr-2 h-5 w-5" />
                Yeni Yazı Oluştur
              </button>
            </div>

            <motion.div
              variants={itemVariants}
              className="grid gap-4 sm:grid-cols-3"
            >
              <div className="yey-card flex items-center justify-between">
                <div>
                  <p className="yey-text-muted text-sm">Toplam</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
                <div className="rounded-xl bg-yey-blue/10 p-3">
                  <FileText className="h-6 w-6 text-yey-blue" />
                </div>
              </div>
              <div className="yey-card flex items-center justify-between">
                <div>
                  <p className="yey-text-muted text-sm">Yayında</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {stats.published}
                  </p>
                </div>
                <div className="rounded-xl bg-green-500/10 p-3">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="yey-card flex items-center justify-between">
                <div>
                  <p className="yey-text-muted text-sm">Taslak</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {stats.draft}
                  </p>
                </div>
                <div className="rounded-xl bg-yey-yellow/10 p-3">
                  <FileText className="h-6 w-6 text-yey-yellow" />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                type="search"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-foreground/20 bg-background py-2.5 pl-10 pr-4 text-foreground placeholder:text-foreground/40 focus:border-yey-turquoise focus:outline-none focus:ring-1 focus:ring-yey-turquoise"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="yey-card overflow-hidden !p-0"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      <th className="px-6 py-4 font-medium text-foreground/60">
                        Başlık
                      </th>
                      <th className="px-6 py-4 font-medium text-foreground/60">
                        Kategori
                      </th>
                      <th className="px-6 py-4 font-medium text-foreground/60">
                        Durum
                      </th>
                      <th className="px-6 py-4 font-medium text-foreground/60">
                        Tarih
                      </th>
                      <th className="px-6 py-4 font-medium text-foreground/60">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {filteredPosts.map((post) => (
                      <tr
                        key={post.id}
                        className="transition-colors hover:bg-foreground/[0.02]"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yey-blue/10 p-2">
                              <FileText className="h-4 w-4 text-yey-blue" />
                            </div>
                            <span className="font-medium text-foreground">
                              {post.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground/60">
                          {post.category ?? "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              post.published
                                ? "bg-green-500/10 text-green-500"
                                : "bg-yey-yellow/10 text-yey-yellow"
                            }`}
                          >
                            {post.published ? "Yayında" : "Taslak"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground/60">
                          {formatDate(post.updated_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(post)}
                              className="rounded-lg p-2 text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-yey-turquoise"
                              title="Düzenle"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(post)}
                              className="rounded-lg p-2 text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-yey-red"
                              title="Sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(post)}
                              className="rounded-lg p-2 text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground"
                              title={post.published ? "Geri Al" : "Yayınla"}
                            >
                              {post.published ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="yey-btn-secondary flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Listeye Dön
              </button>
              <h2 className="yey-heading text-xl">
                {editingPost ? "Yazıyı Düzenle" : "Yeni Yazı Oluştur"}
              </h2>
            </div>

            <div className="yey-card">
              <BlogEditor
                initialData={
                  editingPost
                    ? {
                        ...editingPost,
                        category:
                          categoryToSlug[editingPost.category ?? ""] ??
                          "topluluk",
                      }
                    : undefined
                }
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isSubmitting}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
