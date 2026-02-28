"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Camera, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { updateProfile } from "@/lib/actions/profiles";
import { MOCK_PROFILES } from "@/lib/data/mock-data";

const profileSchema = z.object({
  full_name: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  phone: z.string().optional(),
  push_notifications: z.boolean(),
  email_notifications: z.boolean(),
  whatsapp_notifications: z.boolean(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilDuzenlePage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const displayProfile = profile ?? MOCK_PROFILES[0];
  const displayEmail = user?.email ?? "demo@yeyclub.com";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: displayProfile.full_name,
      phone: displayProfile.phone ?? "",
      push_notifications: displayProfile.notification_prefs?.push ?? true,
      email_notifications: displayProfile.notification_prefs?.email ?? true,
      whatsapp_notifications:
        displayProfile.notification_prefs?.whatsapp ?? false,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);

    const result = await updateProfile({
      full_name: data.full_name,
      phone: data.phone || null,
      notification_prefs: {
        push: data.push_notifications,
        email: data.email_notifications,
        whatsapp: data.whatsapp_notifications,
      },
    });

    setIsSaving(false);

    if (result.success) {
      toast.success("Profil bilgileri güncellendi!");
      router.push("/profil");
    } else {
      toast.error(result.error);
    }
  };

  const toggleField = (
    field: keyof Pick<
      ProfileFormData,
      "push_notifications" | "email_notifications" | "whatsapp_notifications"
    >
  ) => {
    setValue(field, !watch(field), { shouldDirty: true });
  };

  return (
    <div className="yey-container py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <button
          onClick={() => router.push("/profil")}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Profile Dön
        </button>

        <h1 className="yey-heading mb-8 text-3xl">Profili Düzenle</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="yey-card flex flex-col items-center gap-6 p-8">
            <div className="group relative">
              {displayProfile.avatar_url ? (
                <img
                  src={displayProfile.avatar_url}
                  alt={displayProfile.full_name}
                  className="h-28 w-28 rounded-full object-cover ring-4 ring-yey-yellow/30"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-yey-yellow to-yey-turquoise text-3xl font-bold text-yey-dark-bg ring-4 ring-yey-yellow/30">
                  {getInitials(displayProfile.full_name)}
                </div>
              )}
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Camera className="h-6 w-6 text-white" />
              </button>
            </div>
            <p className="text-xs text-foreground/50">
              Fotoğraf değiştirmek için tıklayın
            </p>
          </div>

          <div className="yey-card space-y-5 p-6">
            <div>
              <label
                htmlFor="full_name"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Ad Soyad
              </label>
              <input
                id="full_name"
                type="text"
                {...register("full_name")}
                className={cn(
                  "w-full rounded-lg border bg-background px-4 py-2.5 text-foreground outline-none transition-colors",
                  "focus:border-yey-turquoise focus:ring-2 focus:ring-yey-turquoise/20",
                  errors.full_name
                    ? "border-yey-red"
                    : "border-foreground/10"
                )}
              />
              {errors.full_name && (
                <p className="mt-1 text-xs text-yey-red">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                E-posta
              </label>
              <input
                id="email"
                type="email"
                value={displayEmail}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-2.5 text-foreground/50 outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Telefon
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+90 5XX XXX XX XX"
                {...register("phone")}
                className="w-full rounded-lg border border-foreground/10 bg-background px-4 py-2.5 text-foreground outline-none transition-colors focus:border-yey-turquoise focus:ring-2 focus:ring-yey-turquoise/20"
              />
            </div>
          </div>

          <div className="yey-card space-y-1 p-6">
            <h3 className="mb-4 text-lg font-bold text-foreground">
              Bildirim Tercihleri
            </h3>

            <ToggleRow
              label="Push Bildirimler"
              description="Uygulama içi anlık bildirimler"
              checked={watch("push_notifications")}
              onChange={() => toggleField("push_notifications")}
            />
            <ToggleRow
              label="E-posta Bildirimleri"
              description="Etkinlik ve duyurular e-posta ile"
              checked={watch("email_notifications")}
              onChange={() => toggleField("email_notifications")}
            />
            <ToggleRow
              label="WhatsApp Bildirimleri"
              description="WhatsApp üzerinden hatırlatmalar"
              checked={watch("whatsapp_notifications")}
              onChange={() => toggleField("whatsapp_notifications")}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="yey-btn-primary inline-flex items-center justify-center gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/profil")}
              className="yey-btn-secondary inline-flex items-center justify-center"
            >
              İptal
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-1 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-foreground/50">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200",
          checked ? "bg-yey-turquoise" : "bg-foreground/20"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-md transition-transform duration-200",
            checked ? "translate-x-5.5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
