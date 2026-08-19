import type { ErrorResponse } from "@repo/types/admin/users";

type ApiOptions = RequestInit & {
  errorMessage?: string;
};

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export function resolveApiUrl(path: string) {
  if (path.startsWith("/") && apiBaseUrl) {
    return `${apiBaseUrl}${path}`;
  }

  return path;
}

function resolveApiInput(input: RequestInfo | URL) {
  if (typeof input === "string") {
    return resolveApiUrl(input);
  }

  return input;
}

async function parseError(response: Response, fallback: string) {
  const data = (await response.json().catch(() => ({}))) as ErrorResponse;

  return data.error ?? fallback;
}

export async function adminApi<TResponse>(input: RequestInfo | URL, options: ApiOptions = {}) {
  const { errorMessage = "Request failed.", headers, ...init } = options;
  const response = await fetch(resolveApiInput(input), {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error(await parseError(response, errorMessage));
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}
