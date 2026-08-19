import type { PublicLocationsResponse } from "@repo/types/location";
import { apiJson } from "./api";
import { locationKeys } from "./query-keys";

export function publishedLocationsQuery() {
  return {
    queryKey: locationKeys.published(),
    queryFn: () =>
      apiJson<PublicLocationsResponse>("/api/locations", {
        errorMessage: "Failed to load locations.",
      }),
  };
}
