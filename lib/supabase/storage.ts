import { createClient } from "@/lib/supabase/client";

export async function uploadImage(
  bucket: string,
  file: File,
  path: string
): Promise<string> {
  const supabase = createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (error) throw error;

  return getPublicUrl(bucket, path);
}

export async function deleteImage(
  bucket: string,
  path: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
}

export function getPublicUrl(bucket: string, path: string): string {
  const supabase = createClient();

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}
