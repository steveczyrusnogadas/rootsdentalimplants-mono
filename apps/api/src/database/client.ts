import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
const useSsl = process.env.DATABASE_SSL === "true";

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to start the API database client.");
}

export const db = drizzle({
  connection: {
    connectionString: databaseUrl,
    ...(useSsl ? { ssl: true } : {}),
  },
  schema,
});
