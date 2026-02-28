"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import type { BlogPost } from "@/types";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { ImageUpload } from "@/components/common/ImageUpload";

const BLOG_CATEGORIES = [
  { value: "topluluk", label: "Topluluk" },
  { value: "etkinlik", label: "Etkinlik" },
  { value: "gonulluluk", label: "Gönüllülük" },
  { value: "duyuru", label: "Duyuru" },
] as const;

const blogSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  slug: z
    .string()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug sadece küçük harf, rakam ve tire içerebilir"
    ),
  excerpt: z.string().min(10, "Özet en az 10 karakter olmalıdır"),
  category: z.enum(["topluluk", "etkinlik", "gonulluluk", "duyuru"], {
    message: "Lütfen bir kategori seçin",
  }),
  content: z.string().min(20, "İçerik en az 20 karakter olmalıdır"),
  cover_image: z.string().nullable(),
  published: z.boolean(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export type BlogEditorSubmitData = BlogFormData;

type BlogEditorProps = {
  initialData?: BlogPost & { category?: string };
  onSubmit: (data: BlogEditorSubmitData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/İ/g, "i")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
}

const inputClass =
  "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-foreground/40 transition-colors focus:border-yey-turquoise focus:outline-none focus:ring-1 focus:ring-yey-turquoise";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

const errorClass = "mt-1 text-xs text-yey-red";

export function BlogEditor({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}: BlogEditorProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData, unknown, BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      excerpt: initialData?.excerpt ?? "",
      category: ((initialData as { category?: string })?.category ?? "topluluk") as "topluluk" | "etkinlik" | "gonulluluk" | "duyuru",
      content: initialData?.content ?? "",
      cover_image: initialData?.cover_image ?? null,
      published: initialData?.published ?? false,
    },
  });

  const title = watch("title");
  const published = watch("published");
  const coverImage = watch("cover_image");

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue("title", value);
      if (!initialData) {
        setValue("slug", slugify(value));
      }
    },
    [initialData, setValue]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      <div className="space-y-8">
        <div>
          <label htmlFor="title" className={labelClass}>
            Başlık
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            onChange={handleTitleChange}
            value={title}
            placeholder="Blog yazısı başlığı"
            className={cn(inputClass, "text-xl font-semibold")}
          />
          {errors.title && (
            <p className={errorClass}>{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug
          </label>
          <input
            id="slug"
            type="text"
            {...register("slug")}
            placeholder="blog-yazisi-slug"
            className={inputClass}
          />
          {errors.slug && (
            <p className={errorClass}>{errors.slug.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="excerpt" className={labelClass}>
            Özet
          </label>
          <textarea
            id="excerpt"
            {...register("excerpt")}
            rows={3}
            placeholder="Yazının kısa özeti (2-3 cümle)"
            className={cn(inputClass, "resize-none")}
          />
          {errors.excerpt && (
            <p className={errorClass}>{errors.excerpt.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Kategori
          </label>
          <select id="category" {...register("category")} className={inputClass}>
            {BLOG_CATEGORIES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className={errorClass}>{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className={labelClass}>Kapak Görseli</label>
          <ImageUpload
            bucket="blog-covers"
            currentImageUrl={coverImage}
            onUpload={(url) => setValue("cover_image", url)}
          />
        </div>

        <div>
          <label htmlFor="content" className={labelClass}>
            İçerik
          </label>
          <p className="mb-2 text-xs text-foreground/50">
            Bold, Italic, Link, H2, H3 için HTML kullanabilirsiniz.
          </p>
          <textarea
            id="content"
            {...register("content")}
            rows={14}
            placeholder="Blog içeriğinizi buraya yazın. HTML desteklenmektedir."
            className={cn(inputClass, "min-h-[300px] resize-y font-mono text-sm")}
          />
          {errors.content && (
            <p className={errorClass}>{errors.content.message}</p>
          )}
        </div>

        <div>
          <span className={labelClass}>Yayın Durumu</span>
          <div className="mt-2 flex gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                {...register("published", {
                  setValueAs: (v) => v === "true",
                })}
                value="false"
                className="h-4 w-4 border-border text-yey-turquoise focus:ring-yey-turquoise"
              />
              <span className="text-foreground">Taslak</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                {...register("published", {
                  setValueAs: (v) => v === "true",
                })}
                value="true"
                className="h-4 w-4 border-border text-yey-turquoise focus:ring-yey-turquoise"
              />
              <span className="text-foreground">Yayınla</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-border pt-8">
        <button
          type="submit"
          disabled={isLoading}
          className={cn(
            "yey-btn-primary",
            isLoading && "cursor-not-allowed opacity-60"
          )}
        >
          {isLoading
            ? "Kaydediliyor..."
            : published
              ? "Yayınla"
              : "Taslak Kaydet"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="yey-btn-secondary"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
