import { describe, expect, test } from "bun:test";
import {
  createAdminLocationPayloadSchema,
  updateAdminLocationPayloadSchema,
} from "@repo/types/admin/location";
import { weeklyHoursSchema, type WeeklyHours } from "@repo/types/location";

const closedWeek: WeeklyHours = {
  monday: { kind: "closed" },
  tuesday: { kind: "closed" },
  wednesday: { kind: "closed" },
  thursday: { kind: "closed" },
  friday: { kind: "closed" },
  saturday: { kind: "closed" },
  sunday: { kind: "closed" },
};

const portlandHours: WeeklyHours = {
  monday: { kind: "open", open: "08:00", close: "17:00" },
  tuesday: { kind: "open", open: "08:00", close: "17:00" },
  wednesday: { kind: "open", open: "08:00", close: "17:00" },
  thursday: { kind: "open", open: "08:00", close: "17:00" },
  friday: { kind: "closed" },
  saturday: { kind: "closed" },
  sunday: { kind: "closed" },
};

describe("weeklyHoursSchema", () => {
  test("stores Mon-Sun as closed or open/close wall-clock", () => {
    expect(weeklyHoursSchema.parse(portlandHours)).toEqual(portlandHours);
    expect(weeklyHoursSchema.parse(closedWeek)).toEqual(closedWeek);
  });

  test("rejects a day that is neither closed nor open", () => {
    expect(
      weeklyHoursSchema.safeParse({
        ...portlandHours,
        friday: { closed: true },
      }).success,
    ).toBe(false);
  });

  test("rejects open hours that are not HH:mm wall-clock", () => {
    expect(
      weeklyHoursSchema.safeParse({
        ...portlandHours,
        monday: { kind: "open", open: "8am", close: "5pm" },
      }).success,
    ).toBe(false);
  });
});

describe("createAdminLocationPayloadSchema", () => {
  const portlandCreate = {
    slug: "portland",
    displayName: "Portland",
    street: "4224 NE Halsey St",
    suite: "#330",
    city: "Portland",
    region: "OR",
    postalCode: "97213",
    phone: "503-647-6135",
    weeklyHours: portlandHours,
    lat: 45.5333859,
    lng: -122.6200202,
    sortOrder: 0,
    published: true,
    isDefaultCall: true,
  };

  test("requires slug at create", () => {
    const result = createAdminLocationPayloadSchema.safeParse({ ...portlandCreate, slug: undefined });

    expect(result.success).toBe(false);
  });

  test("accepts the Portland seed shape", () => {
    expect(createAdminLocationPayloadSchema.parse(portlandCreate)).toMatchObject({
      slug: "portland",
      displayName: "Portland",
      street: "4224 NE Halsey St",
      suite: "#330",
      phone: "503-647-6135",
      isDefaultCall: true,
    });
  });
});

describe("updateAdminLocationPayloadSchema", () => {
  test("omits slug so it cannot be changed after create", () => {
    const result = updateAdminLocationPayloadSchema.parse({
      slug: "hollywood",
      displayName: "Portland Implant Center",
    });

    expect(result).toEqual({ displayName: "Portland Implant Center" });
    expect("slug" in result).toBe(false);
  });

  test("allows unpublishing without a slug", () => {
    expect(updateAdminLocationPayloadSchema.parse({ published: false })).toEqual({ published: false });
  });
});
