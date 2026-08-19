import type { AdminLocation } from "@repo/types/admin/location";
import type { PublicLocation } from "@repo/types/location";
import { location } from "../database/schema";

export function serializePublicLocation(record: typeof location.$inferSelect): PublicLocation {
  return {
    id: record.id,
    slug: record.slug,
    displayName: record.displayName,
    street: record.street,
    suite: record.suite,
    city: record.city,
    region: record.region,
    postalCode: record.postalCode,
    phone: record.phone,
    weeklyHours: record.weeklyHours,
    lat: record.lat,
    lng: record.lng,
    sortOrder: record.sortOrder,
    isDefaultCall: record.isDefaultCall,
  };
}

export function serializeAdminLocation(record: typeof location.$inferSelect): AdminLocation {
  return {
    ...serializePublicLocation(record),
    published: record.published,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}
