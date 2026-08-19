// PROTOTYPE — Location picker data for the eligibility-quiz chrome (ticket 11).
// Widget IDs stay in code, keyed by Location.slug (location-and-provider ticket).

export const quizLocations = [
  {
    slug: "portland",
    city: "Portland",
    street: "4224 NE Halsey St #330",
    region: "Portland, OR 97213",
    hours: "Monday – Thursday, 8:00 AM – 5:00 PM",
    phone: "(503) 647-6135",
    widgetId: "6Jqj2q4IejAU265WmjlN",
  },
  {
    slug: "gresham",
    city: "Gresham",
    street: "22400 SE Stark St Suite 103",
    region: "Gresham, OR 97030",
    hours: "Monday – Thursday, 8:00 AM – 5:00 PM",
    phone: "(503) 512-6184",
    widgetId: "pN48bE91TTMcG4spipTf",
  },
  {
    slug: "troutdale",
    city: "Troutdale",
    street: "191 E Historic Columbia River Hwy",
    region: "Troutdale, OR 97060",
    hours: "Tuesday – Friday, 8:00 AM – 5:00 PM",
    phone: "(503) 855-6792",
    widgetId: "qD0PVPyldIKWgTPnepcr",
  },
  {
    slug: "vancouver",
    city: "Vancouver",
    street: "16600 SE 15th St",
    region: "Vancouver, WA 98683",
    hours: "Monday – Thursday, 8:00 AM – 3:00 PM",
    phone: "(360) 310-4683",
    widgetId: "0664GBz8Y5cezIEOKqKE",
  },
  {
    slug: "salem",
    city: "Salem",
    street: "2510 12th St SE",
    region: "Salem, OR 97302",
    hours: "Monday – Friday, 8:00 AM – 3:00 PM",
    phone: "(503) 506-6339",
    widgetId: "AX8Z6PGN67rCkrkJm4Yd",
  },
] as const;

export type QuizLocation = (typeof quizLocations)[number];
export type QuizLocationSlug = QuizLocation["slug"];

export function isQuizLocationSlug(value: string): value is QuizLocationSlug {
  return quizLocations.some((location) => location.slug === value);
}

export function findQuizLocation(slug: string | undefined): QuizLocation | undefined {
  if (!slug) return undefined;
  return quizLocations.find((location) => location.slug === slug);
}

export const quizCopy = {
  headline: "Are you eligible for dental implants?",
  support: "This short quiz helps us see whether implants are a good next step. Choose the location you’d like to visit.",
  pickerLabel: "Select the location where you’d like to be treated",
} as const;
