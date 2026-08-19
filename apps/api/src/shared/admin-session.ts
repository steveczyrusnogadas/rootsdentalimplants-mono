import { auth } from "../auth";

type AdminRole = "admin" | "manager";

export const adminAndManagerRoles = ["admin", "manager"] as const satisfies readonly AdminRole[];

export type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string | null;
};

type AdminSessionOptions = {
  roles?: readonly AdminRole[];
};

export async function getAdminSession(request: Request, options: AdminSessionOptions = {}) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  const sessionUser = session?.user as SessionUser | undefined;
  const allowedRoles = options.roles ?? ["admin"];

  if (!sessionUser) {
    return { error: "Unauthorized", status: 401 as const };
  }

  if (!allowedRoles.some((role) => role === sessionUser.role)) {
    return { error: "Forbidden", status: 403 as const };
  }

  return { sessionUser };
}
