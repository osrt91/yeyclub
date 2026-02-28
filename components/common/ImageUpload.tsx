"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage, deleteImage } from "@/lib/supabase/storage";

type ImageUploadProps = {
  bucket: string;
  currentImageUrl: string | null;
  onUpload: (url: string | null) => void;
  pathPrefix?: string;
};

export function ImageUpload({
  bucket,
  currentImageUrl,
  onUpload,
  pathPrefix = "",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;

      setIsUploading(true);
      setProgress(0);

      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);

      try {
        const ext = file.name.split(".").pop() ?? "jpg";
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const path = pathPrefix ? `${pathPrefix}/${name}` : name;

        const tick = setInterval(() => {
          setProgress((p) => Math.min(p + 12, 90));
        }, 150);

        const url = await uploadImage(bucket, file, path);

        clearInterval(tick);
        setProgress(100);

        URL.revokeObjectURL(localUrl);
        setPreview(url);
        onUpload(url);
      } catch {
        URL.revokeObjectURL(localUrl);
        setPreview(currentImageUrl);
      } finally {
        setTimeout(() => {
          setIsUploading(false);
          setProgress(0);
        }, 300);
      }
    },
    [bucket, pathPrefix, currentImageUrl, onUpload]
  );

  const handleRemove = useCallback(async () => {
    if (!preview) return;

    try {
      const url = new URL(preview);
      const prefix = `/storage/v1/object/public/${bucket}/`;
      const idx = url.pathname.indexOf(prefix);
      if (idx !== -1) {
        await deleteImage(bucket, url.pathname.slice(idx + prefix.length));
      }
    } catch {
      // noop for external or blob URLs
    }

    setPreview(null);
    onUpload(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [preview, bucket, onUpload]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="group relative inline-block overflow-hidden rounded-xl border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Kapak görseli"
            className="max-h-48 w-auto rounded-xl object-cover"
          />
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/50">
              <Loader2 className="h-6 w-6 animate-spin text-white" />
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-yey-turquoise transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors",
            isDragging
              ? "border-yey-turquoise bg-yey-turquoise/5"
              : "border-border hover:border-foreground/40"
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-yey-turquoise" />
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-foreground/10">
                <div
                  className="h-full rounded-full bg-yey-turquoise transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-foreground/50">Yükleniyor...</p>
            </>
          ) : (
            <>
              <div className="rounded-xl bg-foreground/5 p-3">
                <Upload className="h-6 w-6 text-foreground/40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground/70">
                  Görseli sürükleyip bırakın
                </p>
                <p className="mt-1 text-xs text-foreground/40">
                  veya tıklayarak seçin (PNG, JPG, WebP)
                </p>
              </div>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
        }}
      />
    </div>
  );
}
