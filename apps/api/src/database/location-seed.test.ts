import { describe, expect, test } from "bun:test";
import { locationSeedRecords } from "../database/location-seed";

describe("locationSeedRecords", () => {
  test("seeds the five spec Locations with Portland as the default Call", () => {
    expect(
      locationSeedRecords.map((record) => ({
        slug: record.slug,
        displayName: record.displayName,
        street: record.street,
        suite: record.suite,
        city: record.city,
        region: record.region,
        postalCode: record.postalCode,
        phone: record.phone,
        lat: record.lat,
        lng: record.lng,
        isDefaultCall: record.isDefaultCall,
      })),
    ).toEqual([
      {
        slug: "portland",
        displayName: "Portland",
        street: "4224 NE Halsey St",
        suite: "#330",
        city: "Portland",
        region: "OR",
        postalCode: "97213",
        phone: "503-647-6135",
        lat: 45.5333859,
        lng: -122.6200202,
        isDefaultCall: true,
      },
      {
        slug: "gresham",
        displayName: "Gresham",
        street: "22400 SE Stark St",
        suite: "Suite 103",
        city: "Gresham",
        region: "OR",
        postalCode: "97030",
        phone: "503-512-6184",
        lat: 45.5187366,
        lng: -122.43212752704,
        isDefaultCall: false,
      },
      {
        slug: "troutdale",
        displayName: "Troutdale",
        street: "191 E Historic Columbia River Hwy",
        suite: null,
        city: "Troutdale",
        region: "OR",
        postalCode: "97060",
        phone: "503-855-6792",
        lat: 45.5409352,
        lng: -122.38734832471,
        isDefaultCall: false,
      },
      {
        slug: "salem",
        displayName: "Salem",
        street: "2510 12th St SE",
        suite: null,
        city: "Salem",
        region: "OR",
        postalCode: "97302",
        phone: "503-506-6339",
        lat: 44.9166413,
        lng: -123.0302308,
        isDefaultCall: false,
      },
      {
        slug: "vancouver",
        displayName: "Vancouver",
        street: "16600 SE 15th St",
        suite: null,
        city: "Vancouver",
        region: "WA",
        postalCode: "98683",
        phone: "360-310-4683",
        lat: 45.61042565,
        lng: -122.50235005,
        isDefaultCall: false,
      },
    ]);
    expect(locationSeedRecords.filter((record) => record.isDefaultCall)).toHaveLength(1);
  });

  test("stores weekly hours as Mon-Sun closed or open/close wall-clock", () => {
    const bySlug = Object.fromEntries(locationSeedRecords.map((record) => [record.slug, record]));

    expect(bySlug.portland.weeklyHours.monday).toEqual({ kind: "open", open: "08:00", close: "17:00" });
    expect(bySlug.portland.weeklyHours.friday).toEqual({ kind: "closed" });
    expect(bySlug.gresham.weeklyHours.thursday).toEqual({ kind: "open", open: "08:00", close: "17:00" });
    expect(bySlug.gresham.weeklyHours.friday).toEqual({ kind: "closed" });
    expect(bySlug.troutdale.weeklyHours.monday).toEqual({ kind: "closed" });
    expect(bySlug.troutdale.weeklyHours.friday).toEqual({ kind: "open", open: "08:00", close: "17:00" });
    expect(bySlug.salem.weeklyHours.friday).toEqual({ kind: "open", open: "08:00", close: "15:00" });
    expect(bySlug.salem.weeklyHours.saturday).toEqual({ kind: "closed" });
    expect(bySlug.vancouver.weeklyHours.thursday).toEqual({ kind: "open", open: "08:00", close: "15:00" });
    expect(bySlug.vancouver.weeklyHours.friday).toEqual({ kind: "closed" });
  });
});
