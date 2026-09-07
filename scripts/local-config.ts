import { createServer } from "node:net";

export const portDefaults = {
  API_PORT: 3000,
  WEB_PORT: 5173,
  ADMIN_PORT: 5000,
  POSTGRES_PORT: 5050,
  REDIS_PORT: 6379,
  MINIO_PORT: 9000,
  MINIO_CONSOLE_PORT: 9001,
};

export function portsForOffset(offset: number) {
  if (!Number.isInteger(offset) || offset < 0 || offset > 50000) {
    throw new Error("Port offset must be an integer between 0 and 50000.");
  }
  return Object.fromEntries(Object.entries(portDefaults).map(([key, port]) => [key, port + offset]));
}

export async function portAvailable(port: number) {
  return new Promise<boolean>((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => server.close(() => resolve(true)));
  });
}

export function localEnvironment(project: string, offset: number, secret: string) {
  if (!/^[a-z0-9][a-z0-9_-]+$/.test(project)) {
    throw new Error("Project name must use lowercase letters, digits, hyphens or underscores.");
  }
  const ports = portsForOffset(offset);
  const api = `http://localhost:${ports.API_PORT}`;
  const storage = `http://localhost:${ports.MINIO_PORT}`;
  return {
    COMPOSE_PROJECT_NAME: project,
    BETTER_AUTH_COOKIE_PREFIX: project,
    ...ports,
    DATABASE_URL: `postgres://baseplate:baseplate@localhost:${ports.POSTGRES_PORT}/baseplate`,
    DATABASE_SSL: "false",
    REDIS_URL: `redis://localhost:${ports.REDIS_PORT}`,
    BETTER_AUTH_URL: api,
    BETTER_AUTH_SECRET: secret,
    APP_ORIGINS: `http://localhost:${ports.WEB_PORT},http://localhost:${ports.ADMIN_PORT}`,
    INTERNAL_API_URL: api,
    VITE_API_URL: api,
    ADMIN_EMAIL: "admin@example.com",
    ADMIN_PASSWORD: secret.slice(0, 24),
    ADMIN_NAME: "Admin",
    TRUSTED_PROXY_HEADERS: "false",
    S3_ENDPOINT: storage,
    S3_PUBLIC_ENDPOINT: storage,
    S3_REGION: "us-east-1",
    S3_BUCKET: "baseplate",
    S3_ACCESS_KEY_ID: "baseplate",
    S3_SECRET_ACCESS_KEY: "baseplate-minio-password",
    S3_FORCE_PATH_STYLE: "true",
  };
}
