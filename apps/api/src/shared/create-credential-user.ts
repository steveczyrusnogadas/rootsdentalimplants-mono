import { eq } from "drizzle-orm";
import { auth } from "../auth";
import { db } from "../database/client";
import { account, user } from "../database/schema";

type CreateCredentialUserInput = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "manager";
};

/**
 * Creates a credential user when public email sign-up is disabled.
 * Used by seed scripts; admin UI should prefer auth.api.createUser with an admin session.
 */
export async function createCredentialUser(input: CreateCredentialUserInput) {
  const existing = await db.query.user.findFirst({
    where: eq(user.email, input.email),
  });

  if (existing) {
    return existing;
  }

  const ctx = await auth.$context;
  const passwordHash = await ctx.password.hash(input.password);
  const now = new Date();
  const id = crypto.randomUUID();

  const [created] = await db
    .insert(user)
    .values({
      id,
      name: input.name,
      email: input.email,
      emailVerified: true,
      image: null,
      role: input.role,
      banned: false,
      banReason: null,
      banExpires: null,
      twoFactorEnabled: false,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  await db.insert(account).values({
    id: crypto.randomUUID(),
    accountId: created.id,
    providerId: "credential",
    userId: created.id,
    password: passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  return created;
}
