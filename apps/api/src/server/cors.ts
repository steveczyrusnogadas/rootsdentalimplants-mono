import { cors } from "hono/cors";
import { getAppOrigins } from "../config/origins";

export const corsMiddleware = cors({
  origin: getAppOrigins(),
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
