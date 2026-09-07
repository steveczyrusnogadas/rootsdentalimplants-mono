export function homeHead() {
  const title = "Roots Dental Implant Center | Oregon & Washington";
  const description =
    "Explore dental implant care and meet the Roots team. Find your implant center in Portland, Gresham, Troutdale, Salem, or Vancouver.";
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
    ],
  };
}
