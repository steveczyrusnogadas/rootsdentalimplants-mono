import { describe, expect, test } from "bun:test";
import type { PublicLocation } from "@repo/types/location";
import { defaultCallLocation, telHref } from "./call-chrome";

const portland: PublicLocation = {
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
};

const gresham: PublicLocation = {
  ...portland,
  id: "loc-gresham",
  slug: "gresham",
  displayName: "Gresham",
  street: "22400 SE Stark St",
  suite: "Suite 103",
  city: "Gresham",
  postalCode: "97030",
  phone: "503-512-6184",
  lat: 45.5187366,
  lng: -122.43212752704,
  sortOrder: 1,
  isDefaultCall: false,
};

describe("telHref", () => {
  test("builds a tel: link from the stored Location phone", () => {
    expect(telHref("503-647-6135")).toBe("tel:503-647-6135");
  });
});

describe("defaultCallLocation", () => {
  test("picks the Location with isDefaultCall for the footer tel:", () => {
    expect(defaultCallLocation([gresham, portland])?.phone).toBe("503-647-6135");
    expect(defaultCallLocation([gresham, portland])?.displayName).toBe("Portland");
  });

  test("returns nothing when the default Call is unpublished and omitted", () => {
    expect(defaultCallLocation([gresham])).toBeUndefined();
  });
});
