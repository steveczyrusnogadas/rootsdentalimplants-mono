import { z } from "zod";
import { paginationMetaSchema } from "./users.js";

export const mediaAssetSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  altText: z.string().nullable(),
  assetType: z.enum(["image", "video", "pdf"]),
  contentType: z.string(),
  size: z.number(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  durationSeconds: z.number().nullable(),
  tags: z.array(z.string()),
  objectKey: z.string(),
  url: z.string(),
  createdBy: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const mediaAssetsResponseSchema = z.object({
  assets: z.array(mediaAssetSchema),
  pagination: paginationMetaSchema,
});

export const mediaAssetResponseSchema = z.object({
  asset: mediaAssetSchema,
});

export const mediaUploadResponseSchema = z.object({
  id: z.string(),
  key: z.string(),
  uploadUrl: z.string(),
  url: z.string(),
  method: z.literal("PUT"),
  headers: z.record(z.string(), z.string()),
  maxSize: z.number(),
});

const requiredString = (field: string, maxLength: number) =>
  z.string().trim().min(1, `${field} is required.`).max(maxLength, `${field} is too long.`);

const optionalString = (field: string, maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength, `${field} is too long.`)
    .optional()
    .nullable()
    .transform((value) => (value ? value : null));

export const createMediaUploadPayloadSchema = z.object({
  fileName: requiredString("File name", 240),
  altText: optionalString("Alt text", 240),
  assetType: z.enum(["image", "video", "pdf"]),
  contentType: requiredString("Content type", 120),
  size: z.number().positive("Media size is invalid."),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  durationSeconds: z.number().positive().optional().nullable(),
  tags: z.array(requiredString("Tag", 40)).max(12, "Too many tags.").default([]),
});

export const finalizeMediaUploadPayloadSchema = createMediaUploadPayloadSchema.extend({
  id: requiredString("Asset ID", 120),
});

export const updateMediaAssetPayloadSchema = z.object({
  fileName: requiredString("File name", 240).optional(),
  altText: optionalString("Alt text", 240),
  tags: z.array(requiredString("Tag", 40)).max(12, "Too many tags.").optional(),
});

export type MediaAsset = z.infer<typeof mediaAssetSchema>;
export type MediaAssetsResponse = z.infer<typeof mediaAssetsResponseSchema>;
export type MediaAssetResponse = z.infer<typeof mediaAssetResponseSchema>;
export type MediaUploadResponse = z.infer<typeof mediaUploadResponseSchema>;
export type CreateMediaUploadPayload = z.infer<typeof createMediaUploadPayloadSchema>;
export type FinalizeMediaUploadPayload = z.infer<typeof finalizeMediaUploadPayloadSchema>;
export type UpdateMediaAssetPayload = z.infer<typeof updateMediaAssetPayloadSchema>;
