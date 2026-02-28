"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import type { Event } from "@/types";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/common/ImageUpload";

const eventSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  slug: z
    .string()
    .min(3, "Slug en az 3 karakter olmalıdır")
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve tire içerebilir"),
  description: z.string().nullable(),
  category: z.enum(["corba", "iftar", "eglence", "diger"], {
    error: "Lütfen bir kategori seçin",
  }),
  event_date: z.string().min(1, "Tarih ve saat zorunludur"),
  location_name: z.string().nullable(),
  max_participants: z.number().int().positive("Pozitif bir sayı girin").nullable(),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"], {
    error: "Lütfen bir durum seçin",
  }),
  cover_image: z.string().nullable(),
});

type EventFormData = z.infer<typeof eventSchema>;

type EventFormProps = {
  initialData?: Event;
  onSubmit: (data: EventFormData) => void;
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
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const categoryLabels: Record<string, string> = {
  corba: "Çorba",
  iftar: "İftar",
  eglence: "Eğlence",
  diger: "Diğer",
};

const statusLabels: Record<string, string> = {
  upcoming: "Yaklaşan",
  ongoing: "Devam Eden",
  completed: "Tamamlandı",
  cancelled: "İptal Edildi",
};

const inputClass =
  "w-full rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-foreground placeholder:text-foreground/40 transition-colors focus:border-yey-turquoise focus:outline-none focus:ring-1 focus:ring-yey-turquoise";

const labelClass = "mb-1.5 block text-sm font-medium text-foreground";

const errorClass = "mt-1 text-xs text-yey-red";

export function EventForm({ initialData, onSubmit, isLoading }: EventFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData, unknown, EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      category: initialData?.category ?? "diger",
      event_date: initialData?.event_date
        ? initialData.event_date.slice(0, 16)
        : "",
      location_name: initialData?.location_name ?? "",
      max_participants: initialData?.max_participants ?? null,
      status: initialData?.status ?? "upcoming",
      cover_image: initialData?.cover_image ?? null,
    },
  });

  const title = watch("title");
  const coverImage = watch("cover_image");

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setValue("title", value);
    if (!initialData) {
      setValue("slug", slugify(value));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className={labelClass}>
            Başlık
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            onChange={handleTitleChange}
            value={title}
            placeholder="Etkinlik başlığı"
            className={inputClass}
          />
          {errors.title && (
            <p className={errorClass}>{errors.title.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="slug" className={labelClass}>
            Slug
          </label>
          <input
            id="slug"
            type="text"
            {...register("slug")}
            placeholder="etkinlik-slug"
            className={inputClass}
          />
          {errors.slug && (
            <p className={errorClass}>{errors.slug.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Açıklama
          </label>
          <textarea
            id="description"
            {...register("description")}
            rows={4}
            placeholder="Etkinlik açıklaması"
            className={cn(inputClass, "resize-none")}
          />
          {errors.description && (
            <p className={errorClass}>{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Kategori
          </label>
          <select id="category" {...register("category")} className={inputClass}>
            {Object.entries(categoryLabels).map(([value, label]) => (
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
          <label htmlFor="event_date" className={labelClass}>
            Tarih & Saat
          </label>
          <input
            id="event_date"
            type="datetime-local"
            {...register("event_date")}
            className={inputClass}
          />
          {errors.event_date && (
            <p className={errorClass}>{errors.event_date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="location_name" className={labelClass}>
            Mekan Adı
          </label>
          <input
            id="location_name"
            type="text"
            {...register("location_name")}
            placeholder="Etkinlik mekanı"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="max_participants" className={labelClass}>
            Maks Katılımcı
          </label>
          <input
            id="max_participants"
            type="number"
            {...register("max_participants", {
              setValueAs: (v: string) =>
                v === "" ? null : parseInt(v, 10),
            })}
            placeholder="Sınırsız için boş bırakın"
            className={inputClass}
          />
          {errors.max_participants && (
            <p className={errorClass}>{errors.max_participants.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>
            Durum
          </label>
          <select id="status" {...register("status")} className={inputClass}>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className={errorClass}>{errors.status.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Kapak Görseli</label>
          <ImageUpload
            bucket="event-covers"
            currentImageUrl={coverImage ?? null}
            onUpload={(url) => setValue("cover_image", url)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-foreground/10 pt-6">
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
            : initialData
              ? "Etkinlik Güncelle"
              : "Etkinlik Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="yey-btn-secondary"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
