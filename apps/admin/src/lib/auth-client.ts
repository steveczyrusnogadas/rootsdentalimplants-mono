import { createAuthClient } from "better-auth/react";
import { adminClient, twoFactorClient } from "better-auth/client/plugins";
import { ac, authRoles } from "./auth-permissions";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [
    adminClient({
      ac,
      roles: authRoles,
    }),
    twoFactorClient(),
  ],
});
