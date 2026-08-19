import type {
  CreateMediaUploadPayload,
  MediaAsset,
  MediaAssetResponse,
  MediaUploadResponse,
} from "@repo/types/admin/media";
import { adminApi } from "@/lib/api";

export type { MediaAsset };

export const allowedMediaTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
export const allowedMediaLibraryTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "application/pdf",
]);
export const maxMediaImageSizeBytes = 5 * 1024 * 1024;

export function formatMediaDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function getMediaAssetType(contentType: string): MediaAsset["assetType"] {
  if (contentType.startsWith("image/")) {
    return "image";
  }

  if (contentType.startsWith("video/")) {
    return "video";
  }

  return "pdf";
}

async function getImageMetadata(file: File) {
  const url = URL.createObjectURL(file);

  try {
    const image = new Image();
    const loaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Failed to read image metadata."));
    });

    image.src = url;
    await loaded;

    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      durationSeconds: null,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function getVideoMetadata(file: File) {
  const url = URL.createObjectURL(file);

  try {
    const video = document.createElement("video");
    const loaded = new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error("Failed to read video metadata."));
    });

    video.preload = "metadata";
    video.src = url;
    await loaded;

    return {
      width: video.videoWidth || null,
      height: video.videoHeight || null,
      durationSeconds: Number.isFinite(video.duration) ? Math.round(video.duration) : null,
    };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function getMediaMetadata(file: File) {
  const assetType = getMediaAssetType(file.type);

  if (assetType === "image") {
    return getImageMetadata(file);
  }

  if (assetType === "video") {
    return getVideoMetadata(file);
  }

  return {
    width: null,
    height: null,
    durationSeconds: null,
  };
}

export async function uploadMediaAsset(file: File, altText = "") {
  const assetType = getMediaAssetType(file.type);
  const metadata = await getMediaMetadata(file);
  const payload: CreateMediaUploadPayload = {
    fileName: file.name,
    altText: altText || null,
    assetType,
    contentType: file.type,
    size: file.size,
    ...metadata,
    tags: [],
  };
  const upload = await adminApi<MediaUploadResponse>("/api/admin/media/uploads", {
    method: "POST",
    body: JSON.stringify(payload),
    errorMessage: "Failed to prepare media upload.",
  });
  const objectResponse = await fetch(upload.uploadUrl, {
    method: upload.method,
    headers: upload.headers,
    body: file,
  });

  if (!objectResponse.ok) {
    throw new Error("Failed to upload media to object storage.");
  }

  const data = await adminApi<MediaAssetResponse>(`/api/admin/media/${upload.id}/finalize`, {
    method: "POST",
    body: JSON.stringify(payload),
    errorMessage: "Failed to save media asset.",
  });

  return data.asset;
}
