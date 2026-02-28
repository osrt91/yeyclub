"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { submitContactForm } from "@/lib/actions/contact";

const contactSchema = z.object({
  name: z.string().min(1, "Ad Soyad gerekli"),
  email: z.email("Geçerli bir e-posta adresi girin"),
  subject: z.string().min(1, "Konu seçiniz"),
  message: z.string().min(10, "Mesajınız en az 10 karakter olmalıdır"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const subjects = [
  { value: "", label: "Konu seçiniz..." },
  { value: "genel", label: "Genel Bilgi" },
  { value: "etkinlik", label: "Etkinlik Önerisi" },
  { value: "isbirligi", label: "İş Birliği" },
  { value: "gonullu", label: "Gönüllü Olmak İstiyorum" },
  { value: "diger", label: "Diğer" },
];

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  async function onSubmit(data: ContactFormData) {
    if (turnstileSiteKey && !turnstileToken) {
      toast.error("Lütfen CAPTCHA doğrulamasını tamamlayın.");
      return;
    }

    setIsSubmitting(true);
    const result = await submitContactForm(data, turnstileToken ?? "");
    setIsSubmitting(false);

    if (result.success) {
      setIsSuccess(true);
      toast.success("Mesajınız başarıyla gönderildi!");
      reset();
      turnstileRef.current?.reset();
      setTurnstileToken(null);
      setTimeout(() => setIsSuccess(false), 3000);
    } else {
      toast.error("Mesaj gönderilemedi", { description: result.error });
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border bg-card px-4 py-3 text-foreground placeholder:text-foreground/40 transition-colors focus:border-yey-turquoise focus:outline-none focus:ring-2 focus:ring-yey-turquoise/20";
  const errorClass = "mt-1 text-xs text-yey-red";

  return (
    <div className="yey-card">
      <h3 className="yey-heading mb-6 text-2xl">Bize Yazın</h3>

      {isSuccess ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="rounded-full bg-green-500/10 p-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <p className="text-lg font-medium text-foreground">
            Mesajınız gönderildi!
          </p>
          <p className="yey-text-muted text-sm">
            En kısa sürede size dönüş yapacağız.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Ad Soyad
            </label>
            <input
              id="name"
              type="text"
              placeholder="Adınız ve soyadınız"
              className={inputClass}
              {...register("name")}
            />
            {errors.name && (
              <p className={errorClass}>{errors.name.message}</p>
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
              placeholder="ornek@email.com"
              className={inputClass}
              {...register("email")}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Konu
            </label>
            <select id="subject" className={inputClass} {...register("subject")}>
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className={errorClass}>{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Mesaj
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Mesajınızı buraya yazın..."
              className={`${inputClass} resize-none`}
              {...register("message")}
            />
            {errors.message && (
              <p className={errorClass}>{errors.message.message}</p>
            )}
          </div>

          {turnstileSiteKey && (
            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={turnstileSiteKey}
                onSuccess={setTurnstileToken}
                onExpire={() => setTurnstileToken(null)}
                options={{ theme: "auto", size: "flexible" }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || (!!turnstileSiteKey && !turnstileToken)}
            className="yey-btn-primary w-full disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Mesajı Gönder
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
