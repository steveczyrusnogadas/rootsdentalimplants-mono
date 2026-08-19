import type { AdminLocation } from "@repo/types/admin/location";
import { weekdays, type Weekday, type WeeklyHours } from "@repo/types/location";

export type { AdminLocation };

export type LocationPublishedFilter = "all" | "published" | "unpublished";

export const locationPublishedFilterLabels: Record<LocationPublishedFilter, string> = {
  all: "All locations",
  published: "Published",
  unpublished: "Unpublished",
};

export const weekdayLabels: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function closedWeeklyHours(): WeeklyHours {
  return Object.fromEntries(weekdays.map((weekday) => [weekday, { kind: "closed" as const }])) as WeeklyHours;
}

export function slugifyLocationName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function formatLocationAddress(location: Pick<AdminLocation, "street" | "suite" | "city" | "region" | "postalCode">) {
  const street = location.suite ? `${location.street} ${location.suite}` : location.street;

  return `${street}, ${location.city}, ${location.region} ${location.postalCode}`;
}
