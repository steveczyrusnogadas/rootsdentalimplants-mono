import { z } from "zod";

export const weekdays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const weekdaySchema = z.enum(weekdays);

export type Weekday = z.infer<typeof weekdaySchema>;

const wallClockSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Hours must be HH:mm wall-clock.");

export const closedDayHoursSchema = z.object({
  kind: z.literal("closed"),
});

export const openDayHoursSchema = z.object({
  kind: z.literal("open"),
  open: wallClockSchema,
  close: wallClockSchema,
});

export const dayHoursSchema = z.discriminatedUnion("kind", [closedDayHoursSchema, openDayHoursSchema]);

export const weeklyHoursSchema = z.object({
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
  sunday: dayHoursSchema,
});

export const publicLocationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  displayName: z.string(),
  street: z.string(),
  suite: z.string().nullable(),
  city: z.string(),
  region: z.string(),
  postalCode: z.string(),
  phone: z.string(),
  weeklyHours: weeklyHoursSchema,
  lat: z.number(),
  lng: z.number(),
  sortOrder: z.number().int(),
  isDefaultCall: z.boolean(),
});

export const publicLocationsResponseSchema = z.object({
  locations: z.array(publicLocationSchema),
});

export type DayHours = z.infer<typeof dayHoursSchema>;
export type WeeklyHours = z.infer<typeof weeklyHoursSchema>;
export type PublicLocation = z.infer<typeof publicLocationSchema>;
export type PublicLocationsResponse = z.infer<typeof publicLocationsResponseSchema>;
