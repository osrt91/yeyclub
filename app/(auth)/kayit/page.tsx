"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Chrome } from "lucide-react";

const registerSchemaBase = z.object({
  fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
  email: z.email("Geçerli bir e-posta giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  confirmPassword: z.string().min(1, "Şifre tekrarı gereklidir"),
  kvkk: z.boolean(),
});

const registerSchema = registerSchemaBase
  .refine((d) => d.password === d.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  })
  .refine((d) => d.kvkk, {
    message: "KVKK Aydınlatma Metni'ni kabul etmelisiniz",
    path: ["kvkk"],
  });

type RegisterFormData = z.infer<typeof registerSchemaBase>;

export default function KayitPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signUp, signInWithGoogle, isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      kvkk: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { error } = await signUp(data.email, data.password, data.fullName);
    if (error) {
      toast.error("Kayıt başarısız", { description: error.message });
    } else {
      toast.success("Kayıt başarılı!", {
        description: "E-posta adresinize doğrulama linki gönderildi.",
      });
      router.push("/giris");
    }
  };

  const handleGoogleSignUp = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error("Google ile kayıt başarısız", {
        description: error.message,
      });
    }
  };

  const busy = isSubmitting || isLoading;

  const inputClass =
    "w-full rounded-lg border border-foreground/10 bg-background py-3 text-foreground placeholder:text-foreground/40 transition-colors focus:border-yey-turquoise focus:outline-none focus:ring-1 focus:ring-yey-turquoise";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="yey-card">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-yey-yellow">
            YEY CLUB
          </h1>
          <p className="mt-2 yey-text-muted text-sm">Topluluğa katılın</p>
        </div>

        <h2 className="yey-heading mb-6 text-center text-2xl">Kayıt Ol</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
              <input
                type="text"
                placeholder="Ad Soyad"
                autoComplete="name"
                {...register("fullName")}
                className={`${inputClass} pl-10 pr-4`}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-yey-red">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                placeholder="E-posta adresiniz"
                autoComplete="email"
                {...register("email")}
                className={`${inputClass} pl-10 pr-4`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-yey-red">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Şifreniz"
                autoComplete="new-password"
                {...register("password")}
                className={`${inputClass} pl-10 pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 transition-colors hover:text-foreground/60"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-yey-red">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Şifre tekrarı"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className={`${inputClass} pl-10 pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 transition-colors hover:text-foreground/60"
                tabIndex={-1}
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-yey-red">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                {...register("kvkk")}
                className="mt-1 h-4 w-4 rounded border-foreground/20 accent-yey-turquoise"
              />
              <span className="text-sm yey-text-muted">
                <span className="cursor-pointer text-yey-turquoise hover:underline">
                  KVKK Aydınlatma Metni
                </span>
                &apos;ni okudum ve kabul ediyorum
              </span>
            </label>
            {errors.kvkk && (
              <p className="mt-1 text-sm text-yey-red">
                {errors.kvkk.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={busy}
            className="yey-btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Kayıt yapılıyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Kayıt Ol
              </span>
            )}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-foreground/10" />
          <span className="text-sm yey-text-muted">veya</span>
          <div className="h-px flex-1 bg-foreground/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isLoading}
          className="yey-btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Chrome className="mr-2 h-5 w-5" />
          Google ile Kayıt
        </button>

        <p className="mt-6 text-center text-sm yey-text-muted">
          Zaten hesabın var mı?{" "}
          <Link
            href="/giris"
            className="font-medium text-yey-turquoise transition-colors hover:text-yey-turquoise/80"
          >
            Giriş yap
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
