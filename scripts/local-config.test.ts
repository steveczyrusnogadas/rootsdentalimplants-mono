import { expect, test } from "bun:test";
import { localEnvironment, portsForOffset, portAvailable } from "./local-config";
import { createServer } from "node:net";

test("project offsets coordinate every client with its service and origins", () => {
  const env = localEnvironment("example-two", 100, "secret");
  expect(env.BETTER_AUTH_COOKIE_PREFIX).toBe("example-two");
  expect(env.API_PORT).toBe(3100);
  expect(env.DATABASE_URL).toContain(":5150/");
  expect(env.REDIS_URL).toBe("redis://localhost:6479");
  expect(env.VITE_API_URL).toBe(env.INTERNAL_API_URL);
  expect(env.BETTER_AUTH_URL).toBe(env.INTERNAL_API_URL);
  expect(env.APP_ORIGINS).toBe("http://localhost:5273,http://localhost:5100");
  expect(env.S3_PUBLIC_ENDPOINT).toBe("http://localhost:9100");
  expect(env.S3_ENDPOINT).toBe(env.S3_PUBLIC_ENDPOINT);
});

test("rejects invalid identity and port ranges", () => {
  expect(() => localEnvironment("Bad Name", 0, "secret")).toThrow();
  for (const offset of [-1, NaN, 0.5, 50001]) expect(() => portsForOffset(offset)).toThrow();
});

test("detects occupied ports", async () => {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  try {
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("Missing port");
    expect(await portAvailable(address.port)).toBe(false);
  } finally {
    server.close();
  }
});

test("production Compose scopes every persistent resource and keeps host ports private", async () => {
  const source = await Bun.file(new URL("../docker-compose.prod.yml", import.meta.url)).text();
  const required = Object.fromEntries(
    [...source.matchAll(/\$\{([A-Z0-9_]+):\?/g)].map((match) => [match[1]!, "test-value"]),
  );
  const render = (project: string) => {
    const result = Bun.spawnSync(["docker", "compose", "-f", "docker-compose.prod.yml", "config", "--format", "json"], {
      cwd: new URL("..", import.meta.url).pathname,
      env: { ...process.env, ...required, COMPOSE_PROJECT_NAME: project },
    });
    if (result.exitCode) throw new Error(result.stderr.toString());
    return JSON.parse(result.stdout.toString());
  };
  const first = render("client-one");
  const second = render("client-two");
  expect(first.networks.default.name).not.toBe(second.networks.default.name);
  for (const key of Object.keys(first.volumes)) expect(first.volumes[key].name).not.toBe(second.volumes[key].name);
  for (const service of Object.values(first.services) as Record<string, unknown>[]) {
    expect(service.container_name).toBeUndefined();
    expect(service.ports).toBeUndefined();
    expect(service.networks).toEqual({ default: null });
  }
});

test("setup preserves saved identity and secrets on rerun", async () => {
  const { mkdtempSync, cpSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const directory = mkdtempSync(join(tmpdir(), "baseplate-setup-"));
  try {
    cpSync(import.meta.dir, join(directory, "scripts"), { recursive: true });
    const run = (args: string[] = []) =>
      Bun.spawnSync([process.execPath, "run", "scripts/setup.ts", "--configure-only", ...args], {
        cwd: directory,
        env: { PATH: process.env.PATH },
      });
    const first = run();
    expect(first.exitCode).toBe(0);
    const saved = await Bun.file(join(directory, ".env")).text();
    expect(saved).toContain("COMPOSE_PROJECT_NAME=baseplate-setup-");
    expect(run().exitCode).toBe(0);
    expect(await Bun.file(join(directory, ".env")).text()).toBe(saved);
    expect(run(["--project=changed"]).exitCode).not.toBe(0);
    expect(await Bun.file(join(directory, ".env")).text()).toBe(saved);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
