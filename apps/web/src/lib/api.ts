import type { ErrorResponse } from "@repo/types/admin/users";
import { createIsomorphicFn } from "@tanstack/react-start";

type ApiOptions = RequestInit & {
  errorMessage?: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function publicApiOrigin() {
  const origin = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

  if (!origin || !/^https?:\/\//i.test(origin)) {
    throw new Error("VITE_API_URL is required and must be an absolute URL.");
  }

  return origin;
}

const jsonApiOrigin = createIsomorphicFn()
  .server(() => process.env.INTERNAL_API_URL?.replace(/\/$/, "") || "http://localhost:3000")
  .client(() => publicApiOrigin());

export function resolveApiUrl(path: string) {
  if (path.startsWith("/")) {
    return `${publicApiOrigin()}${path}`;
  }

  return path;
}

function resolveApiInput(input: RequestInfo | URL) {
  if (typeof input === "string" && input.startsWith("/")) {
    return `${jsonApiOrigin()}${input}`;
  }

  return input;
}

async function parseError(response: Response, fallback: string) {
  const data = (await response.json().catch(() => ({}))) as ErrorResponse;

  return data.error ?? fallback;
}

export async function apiJson<TResponse>(input: RequestInfo | URL, options: ApiOptions = {}) {
  const { errorMessage = "Request failed.", headers, ...init } = options;
  const response = await fetch(resolveApiInput(input), {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(await parseError(response, errorMessage), response.status);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}
