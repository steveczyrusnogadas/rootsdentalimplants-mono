import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { inArray } from "drizzle-orm";
import { Hono } from "hono";
import type { PublicLocationsResponse } from "@repo/types/location";
import { locationSeedRecords } from "../database/location-seed";

process.env.DATABASE_URL ??= "postgres://baseplate:baseplate@localhost:5050/baseplate";
process.env.BETTER_AUTH_SECRET ??= "test-secret-for-location-routes";
process.env.BETTER_AUTH_URL ??= "http://localhost:3000";

const closedWeek = {
  monday: { kind: "closed" as const },
  tuesday: { kind: "closed" as const },
  wednesday: { kind: "closed" as const },
  thursday: { kind: "closed" as const },
  friday: { kind: "closed" as const },
  saturday: { kind: "closed" as const },
  sunday: { kind: "closed" as const },
};

describe("locationRoutes", () => {
  let app: Hono;
  const publishedId = crypto.randomUUID();
  const unpublishedId = crypto.randomUUID();

  beforeAll(async () => {
    const { db } = await import("../database/client");
    const { location } = await import("../database/schema");
    const { locationRoutes } = await import("./locations");

    app = new Hono();
    app.route("/", locationRoutes);

    const now = new Date();
    await db.insert(location).values([
      {
        id: publishedId,
        slug: "test-published-call",
        displayName: "Test Published",
        street: "1 Test St",
        suite: null,
        city: "Portland",
        region: "OR",
        postalCode: "97213",
        phone: "503-000-0001",
        weeklyHours: closedWeek,
        lat: 45.5,
        lng: -122.6,
        sortOrder: 90,
        published: true,
        isDefaultCall: false,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: unpublishedId,
        slug: "test-unpublished-call",
        displayName: "Test Unpublished",
        street: "2 Test St",
        suite: null,
        city: "Salem",
        region: "OR",
        postalCode: "97302",
        phone: "503-000-0002",
        weeklyHours: closedWeek,
        lat: 44.9,
        lng: -123.0,
        sortOrder: 91,
        published: false,
        isDefaultCall: false,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  });

  afterAll(async () => {
    const { db } = await import("../database/client");
    const { location } = await import("../database/schema");

    await db.delete(location).where(inArray(location.id, [publishedId, unpublishedId]));
  });

  test("omits unpublished Locations from the public Call list", async () => {
    const response = await app.request("/api/locations");
    const body = (await response.json()) as PublicLocationsResponse;
    const slugs = body.locations.map((record) => record.slug);

    expect(response.status).toBe(200);
    expect(slugs).toContain("test-published-call");
    expect(slugs).not.toContain("test-unpublished-call");
    expect(body.locations.find((record) => record.slug === "test-unpublished-call")).toBeUndefined();
  });

  test("returns seed phones and the Portland default Call when those rows exist", async () => {
    const response = await app.request("/api/locations");
    const body = (await response.json()) as PublicLocationsResponse;
    const bySlug = Object.fromEntries(body.locations.map((record) => [record.slug, record]));
    const portlandSeed = locationSeedRecords.find((record) => record.slug === "portland");

    if (!bySlug.portland || !portlandSeed) {
      return;
    }

    expect(bySlug.portland.phone).toBe("503-647-6135");
    expect(bySlug.portland.isDefaultCall).toBe(true);
    expect(body.locations.filter((record) => record.isDefaultCall)).toHaveLength(1);
  });
});
