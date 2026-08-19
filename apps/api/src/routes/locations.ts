import { asc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../database/client";
import { location } from "../database/schema";
import { serializePublicLocation } from "../locations/serialize";

export const locationRoutes = new Hono();

locationRoutes.get("/api/locations", async (c) => {
  const records = await db
    .select()
    .from(location)
    .where(eq(location.published, true))
    .orderBy(asc(location.sortOrder), asc(location.displayName));

  return c.json({ locations: records.map(serializePublicLocation) });
});
