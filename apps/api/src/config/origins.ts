const localOrigins = ["http://localhost:5173", "http://localhost:5000"];

function parseOrigins(value: string | undefined) {
  return value
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getAppOrigins() {
  const configured = parseOrigins(process.env.APP_ORIGINS) ?? [];
  const merged = localOrigins.concat(configured);

  return Array.from(new Set(merged));
}
