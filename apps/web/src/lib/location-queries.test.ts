import { afterEach, describe, expect, test } from "bun:test";
import type { PublicLocation } from "@repo/types/location";
import { publishedLocationsQuery } from "./location-queries";

const originalFetch = globalThis.fetch;
const originalInternalApiUrl = process.env.INTERNAL_API_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;

  if (originalInternalApiUrl === undefined) {
    delete process.env.INTERNAL_API_URL;
  } else {
    process.env.INTERNAL_API_URL = originalInternalApiUrl;
  }
});

const publishedLocations: PublicLocation[] = [
  {
    id: "loc-portland",
    slug: "portland",
    displayName: "Portland",
    street: "4224 NE Halsey St",
    suite: "#330",
    city: "Portland",
    region: "OR",
    postalCode: "97213",
    phone: "503-647-6135",
    weeklyHours: {
      monday: { kind: "open", open: "08:00", close: "17:00" },
      tuesday: { kind: "open", open: "08:00", close: "17:00" },
      wednesday: { kind: "open", open: "08:00", close: "17:00" },
      thursday: { kind: "open", open: "08:00", close: "17:00" },
      friday: { kind: "closed" },
      saturday: { kind: "closed" },
      sunday: { kind: "closed" },
    },
    lat: 45.5333859,
    lng: -122.6200202,
    sortOrder: 0,
    isDefaultCall: true,
  },
  {
    id: "loc-gresham",
    slug: "gresham",
    displayName: "Gresham",
    street: "22400 SE Stark St",
    suite: "Suite 103",
    city: "Gresham",
    region: "OR",
    postalCode: "97030",
    phone: "503-512-6184",
    weeklyHours: {
      monday: { kind: "open", open: "08:00", close: "17:00" },
      tuesday: { kind: "open", open: "08:00", close: "17:00" },
      wednesday: { kind: "open", open: "08:00", close: "17:00" },
      thursday: { kind: "open", open: "08:00", close: "17:00" },
      friday: { kind: "closed" },
      saturday: { kind: "closed" },
      sunday: { kind: "closed" },
    },
    lat: 45.5187366,
    lng: -122.43212752704,
    sortOrder: 1,
    isDefaultCall: false,
  },
];

describe("publishedLocationsQuery", () => {
  test("loads published Locations from Hono for Call and footer", async () => {
    delete process.env.INTERNAL_API_URL;
    const requested: string[] = [];

    globalThis.fetch = (async (input: RequestInfo | URL) => {
      requested.push(String(input));
      return new Response(JSON.stringify({ locations: publishedLocations }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }) as typeof fetch;

    const data = await publishedLocationsQuery().queryFn();

    expect(requested).toEqual(["http://localhost:3000/api/locations"]);
    expect(data.locations.map((location) => location.slug)).toEqual(["portland", "gresham"]);
    expect(data.locations.map((location) => location.phone)).toEqual(["503-647-6135", "503-512-6184"]);
  });
});
