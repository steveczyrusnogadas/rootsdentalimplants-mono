import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { locationSeedRecords } from "./location-seed";
import { location } from "./schema";

export async function seedLocations() {
  let created = 0;

  for (const record of locationSeedRecords) {
    const existing = await db.query.location.findFirst({
      where: eq(location.slug, record.slug),
    });

    if (existing) {
      continue;
    }

    const now = new Date();
    await db.insert(location).values({
      id: crypto.randomUUID(),
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
      published: record.published,
      isDefaultCall: record.isDefaultCall,
      createdAt: now,
      updatedAt: now,
    });
    created += 1;
  }

  return created;
}

async function main() {
  const created = await seedLocations();

  console.log(`Seeded ${created} Location${created === 1 ? "" : "s"}.`);
}

const isDirectRun = import.meta.main;

if (isDirectRun) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}
