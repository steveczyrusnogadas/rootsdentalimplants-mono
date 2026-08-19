import type { WeeklyHours } from "@repo/types/location";
import { weekdays, type Weekday } from "@repo/types/location";

type SeedDayHours = { openDays: readonly Weekday[]; open: string; close: string };

function weeklyHours({ openDays, open, close }: SeedDayHours): WeeklyHours {
  const openSet = new Set(openDays);

  return Object.fromEntries(
    weekdays.map((weekday) => [
      weekday,
      openSet.has(weekday) ? { kind: "open" as const, open, close } : { kind: "closed" as const },
    ]),
  ) as WeeklyHours;
}

export const locationSeedRecords = [
  {
    slug: "portland",
    displayName: "Portland",
    street: "4224 NE Halsey St",
    suite: "#330",
    city: "Portland",
    region: "OR",
    postalCode: "97213",
    phone: "503-647-6135",
    weeklyHours: weeklyHours({
      openDays: ["monday", "tuesday", "wednesday", "thursday"],
      open: "08:00",
      close: "17:00",
    }),
    lat: 45.5333859,
    lng: -122.6200202,
    sortOrder: 0,
    published: true,
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
    weeklyHours: weeklyHours({
      openDays: ["monday", "tuesday", "wednesday", "thursday"],
      open: "08:00",
      close: "17:00",
    }),
    lat: 45.5187366,
    lng: -122.43212752704,
    sortOrder: 1,
    published: true,
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
    weeklyHours: weeklyHours({
      openDays: ["tuesday", "wednesday", "thursday", "friday"],
      open: "08:00",
      close: "17:00",
    }),
    lat: 45.5409352,
    lng: -122.38734832471,
    sortOrder: 2,
    published: true,
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
    weeklyHours: weeklyHours({
      openDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      open: "08:00",
      close: "15:00",
    }),
    lat: 44.9166413,
    lng: -123.0302308,
    sortOrder: 3,
    published: true,
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
    weeklyHours: weeklyHours({
      openDays: ["monday", "tuesday", "wednesday", "thursday"],
      open: "08:00",
      close: "15:00",
    }),
    lat: 45.61042565,
    lng: -122.50235005,
    sortOrder: 4,
    published: true,
    isDefaultCall: false,
  },
] as const;
