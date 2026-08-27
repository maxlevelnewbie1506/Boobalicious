"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  label: string;
  multiple?: boolean;
  onUploaded: (urls: string[]) => void;
};

export function ImageUploader({ label, multiple = false, onUploaded }: Props) {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewCount, setPreviewCount] = useState(0);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("character-images")
        .upload(path, file);

      if (uploadError) {
        setError(`Failed to upload ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data } = supabase.storage.from("character-images").getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    setUploading(false);
    setPreviewCount((c) => c + urls.length);
    onUploaded(urls);
    e.target.value = "";
  }

  return (
    <div>
      <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--paper-dim)]">
        {label}
      </label>
      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFiles}
        disabled={uploading}
        className="mt-1 block w-full text-sm text-[var(--paper-dim)] file:mr-3 file:rounded-sm file:border-0 file:bg-[var(--surface-raised)] file:px-3 file:py-2 file:font-mono file:text-xs file:uppercase file:tracking-[0.15em] file:text-[var(--paper)]"
      />
      {uploading && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--paper-dim)]">
          Uploading…
        </p>
      )}
      {!uploading && previewCount > 0 && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--tape)]">
          {previewCount} image{previewCount > 1 ? "s" : ""} uploaded
        </p>
      )}
      {error && <p className="mt-1 font-mono text-[10px] text-[var(--tape)]">{error}</p>}
    </div>
  );
}
