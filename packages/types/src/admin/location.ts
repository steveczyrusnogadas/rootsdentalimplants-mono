import { z } from "zod";
import { publicLocationSchema, weeklyHoursSchema } from "../location.js";
import { paginationMetaSchema } from "./users.js";

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

export const locationSlugSchema = requiredString("Slug", 80).regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "Slug must use lowercase letters, numbers, and hyphens.",
);

export const adminLocationSchema = publicLocationSchema.extend({
  published: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const adminLocationsResponseSchema = z.object({
  locations: z.array(adminLocationSchema),
  pagination: paginationMetaSchema,
});

export const adminLocationResponseSchema = z.object({
  location: adminLocationSchema,
});

export const createAdminLocationPayloadSchema = z.object({
  slug: locationSlugSchema,
  displayName: requiredString("Display name", 80),
  street: requiredString("Street", 180),
  suite: optionalString("Suite", 80),
  city: requiredString("City", 80),
  region: requiredString("Region", 8),
  postalCode: requiredString("Postal code", 16),
  phone: requiredString("Phone", 32),
  weeklyHours: weeklyHoursSchema,
  lat: z.number().gte(-90).lte(90),
  lng: z.number().gte(-180).lte(180),
  sortOrder: z.number().int(),
  published: z.boolean().default(true),
  isDefaultCall: z.boolean().default(false),
});

export const updateAdminLocationPayloadSchema = createAdminLocationPayloadSchema.omit({ slug: true }).partial().extend({
  published: z.boolean().optional(),
  isDefaultCall: z.boolean().optional(),
});

export type AdminLocation = z.infer<typeof adminLocationSchema>;
export type AdminLocationsResponse = z.infer<typeof adminLocationsResponseSchema>;
export type AdminLocationResponse = z.infer<typeof adminLocationResponseSchema>;
export type CreateAdminLocationPayload = z.infer<typeof createAdminLocationPayloadSchema>;
export type UpdateAdminLocationPayload = z.infer<typeof updateAdminLocationPayloadSchema>;
