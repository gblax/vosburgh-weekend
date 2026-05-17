"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

interface PhotoFieldProps {
  value: string;
  onChange: (url: string) => void;
}

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;
const BUCKET = "event-photos";

export function PhotoField({ value, onChange }: PhotoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const { blob, ext, contentType } = await processFile(file);
      const supabase = createClient();
      const filename = `${Date.now()}-${randomId()}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from(BUCKET)
        .upload(filename, blob, { contentType, upsert: false });
      if (uploadErr) throw uploadErr;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
      onChange(data.publicUrl);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Couldn't upload that photo";
      setError(message);
    } finally {
      setUploading(false);
    }
  }

  function remove() {
    onChange("");
    setError(null);
  }

  function openPicker() {
    inputRef.current?.click();
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handlePick}
        aria-hidden
        tabIndex={-1}
      />
      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-harbor-200 bg-harbor-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Event photo preview"
            className="block max-h-72 w-full object-cover"
          />
          <div className="absolute right-2 top-2 flex gap-1.5">
            <button
              type="button"
              onClick={openPicker}
              disabled={uploading}
              className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-harbor-800 shadow-sm backdrop-blur-sm hover:bg-white disabled:opacity-60"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={remove}
              disabled={uploading}
              className="rounded-full bg-white/95 p-1.5 text-rose-700 shadow-sm backdrop-blur-sm hover:bg-white disabled:opacity-60"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-harbor-900/45 backdrop-blur-sm">
              <Loader2 className="h-7 w-7 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={uploading}
          className="flex h-36 w-full flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-harbor-300 bg-white text-harbor-700 transition-colors hover:border-harbor-400 hover:bg-harbor-50 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm font-medium">Uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus className="h-7 w-7 text-harbor-500" />
              <span className="text-sm font-semibold text-harbor-800">
                Tap to add a photo
              </span>
              <span className="text-[11px] text-harbor-700/65">
                Pick from camera or library
              </span>
            </>
          )}
        </button>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-rose-700">{error}</p>
      )}
    </div>
  );
}

interface ProcessedFile {
  blob: Blob;
  ext: string;
  contentType: string;
}

async function processFile(file: File): Promise<ProcessedFile> {
  try {
    const resized = await resizeToJpeg(file);
    return { blob: resized, ext: "jpg", contentType: "image/jpeg" };
  } catch {
    return {
      blob: file,
      ext: extFromMime(file.type) ?? "bin",
      contentType: file.type || "application/octet-stream",
    };
  }
}

async function resizeToJpeg(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const { width, height } = scaleFit(
      img.naturalWidth,
      img.naturalHeight,
      MAX_DIMENSION,
    );
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    );
    if (!blob) throw new Error("Encode failed");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn't decode this image format"));
    img.src = src;
  });
}

function scaleFit(w: number, h: number, max: number) {
  if (w <= max && h <= max) return { width: w, height: h };
  if (w >= h) return { width: max, height: Math.round((h / w) * max) };
  return { width: Math.round((w / h) * max), height: max };
}

function extFromMime(mime: string): string | null {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/heic":
      return "heic";
    case "image/heif":
      return "heif";
    case "image/gif":
      return "gif";
    default:
      return null;
  }
}

function randomId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 12);
}
