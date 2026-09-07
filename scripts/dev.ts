import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { portAvailable, portDefaults } from "./local-config";

process.chdir(resolve(import.meta.dir, ".."));
if (!existsSync(".env") || !process.env.COMPOSE_PROJECT_NAME) {
  throw new Error("Run bun run setup first to configure this checkout's ports and services.");
}
for (const key of ["API_PORT", "WEB_PORT", "ADMIN_PORT"] as const) {
  const port = Number(process.env[key] || portDefaults[key]);
  if (!(await portAvailable(port)))
    throw new Error(
      `${key}=${port} is busy. Stop the other process or update this checkout's coordinated ports/origins.`,
    );
}
const child = Bun.spawn(["bun", "x", "turbo", "run", "dev", ...process.argv.slice(2)], {
  stdout: "inherit",
  stderr: "inherit",
  stdin: "inherit",
});
process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
process.exit(await child.exited);
