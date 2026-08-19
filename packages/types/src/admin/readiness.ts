import { z } from "zod";

export const readinessCheckStatusSchema = z.enum(["ok", "error"]);
export const readinessStatusSchema = z.enum(["ready", "not_ready"]);

export const readinessCheckSchema = z.object({
  status: readinessCheckStatusSchema,
  message: z.string(),
});

export const readinessResponseSchema = z.object({
  status: readinessStatusSchema,
  checks: z.object({
    database: readinessCheckSchema,
    redis: readinessCheckSchema,
    storage: readinessCheckSchema,
    auth: readinessCheckSchema,
  }),
  checkedAt: z.string(),
});

export type ReadinessCheckStatus = z.infer<typeof readinessCheckStatusSchema>;
export type ReadinessStatus = z.infer<typeof readinessStatusSchema>;
export type ReadinessCheck = z.infer<typeof readinessCheckSchema>;
export type ReadinessResponse = z.infer<typeof readinessResponseSchema>;
