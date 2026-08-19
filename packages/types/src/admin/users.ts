import { z } from "zod";

export const userRoleSchema = z.enum(["admin", "manager"]);

export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  role: userRoleSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const paginationMetaSchema = z.object({
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
});

export const usersResponseSchema = z.object({
  users: z.array(adminUserSchema),
  pagination: paginationMetaSchema,
});

export const userResponseSchema = z.object({
  user: adminUserSchema,
});

export const errorResponseSchema = z.object({
  error: z.string().optional(),
});

const requiredString = (field: string) => z.string().trim().min(1, `${field} is required.`);

export const createAdminUserPayloadSchema = z.object({
  name: requiredString("Name"),
  email: requiredString("Email"),
  password: requiredString("Password"),
  role: userRoleSchema.default("manager"),
});

export const updateAdminUserPayloadSchema = z.object({
  name: requiredString("Name"),
  email: requiredString("Email"),
  role: userRoleSchema,
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type AdminUser = z.infer<typeof adminUserSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type UsersResponse = z.infer<typeof usersResponseSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type CreateAdminUserPayload = z.infer<typeof createAdminUserPayloadSchema>;
export type UpdateAdminUserPayload = z.infer<typeof updateAdminUserPayloadSchema>;
