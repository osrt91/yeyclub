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
import { Mail, Lock, Eye, EyeOff, LogIn, Chrome } from "lucide-react";

const loginSchema = z.object({
  email: z.email("Geçerli bir e-posta giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function GirisPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle, isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password);
    if (error) {
      toast.error("Giriş başarısız", { description: error.message });
    } else {
      toast.success("Giriş başarılı!");
      router.push("/");
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error("Google ile giriş başarısız", { description: error.message });
    }
  };

  const busy = isSubmitting || isLoading;

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
          <p className="mt-2 yey-text-muted text-sm">
            Hesabınıza giriş yapın
          </p>
        </div>

        <h2 className="yey-heading mb-6 text-center text-2xl">Giriş Yap</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                placeholder="E-posta adresiniz"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-lg border border-foreground/10 bg-background py-3 pl-10 pr-4 text-foreground placeholder:text-foreground/40 transition-colors focus:border-yey-turquoise focus:outline-none focus:ring-1 focus:ring-yey-turquoise"
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
                autoComplete="current-password"
                {...register("password")}
                className="w-full rounded-lg border border-foreground/10 bg-background py-3 pl-10 pr-12 text-foreground placeholder:text-foreground/40 transition-colors focus:border-yey-turquoise focus:outline-none focus:ring-1 focus:ring-yey-turquoise"
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
                Giriş yapılıyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Giriş Yap
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
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="yey-btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Chrome className="mr-2 h-5 w-5" />
          Google ile Giriş
        </button>

        <p className="mt-6 text-center text-sm yey-text-muted">
          Hesabın yok mu?{" "}
          <Link
            href="/kayit"
            className="font-medium text-yey-turquoise transition-colors hover:text-yey-turquoise/80"
          >
            Kayıt ol
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
