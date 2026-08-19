import type { PublicLocation } from "@repo/types/location";

export function telHref(phone: string) {
  return `tel:${phone}`;
}

export function defaultCallLocation(locations: readonly PublicLocation[]) {
  return locations.find((location) => location.isDefaultCall);
}
