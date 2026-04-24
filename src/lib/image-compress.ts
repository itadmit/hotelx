/**
 * Resize and compress an image in the browser for storing as a data URL
 * on `Service.image` (no external bucket required).
 */
export async function fileToCompressedDataUrl(
  file: File,
  options?: { maxDimension?: number; maxChars?: number }
): Promise<string> {
  const maxDimension = options?.maxDimension ?? 1200;
  const maxChars = options?.maxChars ?? 480_000;

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPEG, PNG, WebP, etc.).");
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not load image"));
    el.src = dataUrl;
  });

  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (w < 1 || h < 1) {
    throw new Error("Invalid image dimensions.");
  }

  if (w > maxDimension) {
    h = Math.round((h * maxDimension) / w);
    w = maxDimension;
  }
  if (h > maxDimension) {
    w = Math.round((w * maxDimension) / h);
    h = maxDimension;
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not process image.");
  }
  ctx.drawImage(img, 0, 0, w, h);

  let quality = 0.88;
  let out = canvas.toDataURL("image/jpeg", quality);
  while (out.length > maxChars && quality > 0.45) {
    quality -= 0.07;
    out = canvas.toDataURL("image/jpeg", quality);
  }

  if (out.length > maxChars) {
    throw new Error(
      "Image is still too large after compression. Try a smaller photo."
    );
  }

  return out;
}

/**
 * Resize an image in the browser and return a compressed JPEG Blob, suitable
 * for uploading to object storage (R2) via multipart FormData.
 */
export async function fileToCompressedBlob(
  file: File,
  options?: { maxDimension?: number; maxBytes?: number }
): Promise<Blob> {
  const maxDimension = options?.maxDimension ?? 1600;
  const maxBytes = options?.maxBytes ?? 800_000;

  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPEG, PNG, WebP, etc.).");
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  let w: number;
  let h: number;
  let drawable: CanvasImageSource;
  if (bitmap) {
    w = bitmap.width;
    h = bitmap.height;
    drawable = bitmap;
  } else {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Could not load image"));
        el.src = url;
      });
      w = img.naturalWidth;
      h = img.naturalHeight;
      drawable = img;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  if (w < 1 || h < 1) throw new Error("Invalid image dimensions.");
  if (w > maxDimension) {
    h = Math.round((h * maxDimension) / w);
    w = maxDimension;
  }
  if (h > maxDimension) {
    w = Math.round((w * maxDimension) / h);
    h = maxDimension;
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image.");
  ctx.drawImage(drawable, 0, 0, w, h);

  let quality = 0.88;
  let blob = await canvasToBlob(canvas, quality);
  while (blob.size > maxBytes && quality > 0.45) {
    quality -= 0.07;
    blob = await canvasToBlob(canvas, quality);
  }

  return blob;
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Compression failed"))),
      "image/jpeg",
      quality
    );
  });
}

export function isAllowedServiceImageValue(value: string | null): boolean {
  if (value == null || value === "") return true;
  if (value.startsWith("data:image/")) return value.length <= 2_000_000;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
