import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./client";
import { user } from "./schema";
import { closeQueues } from "../jobs/queues";
import { createCredentialUser } from "../shared/create-credential-user";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;
const adminName = process.env.ADMIN_NAME ?? "Admin";

async function main() {
  if (!adminEmail) {
    throw new Error("ADMIN_EMAIL is required to seed the first admin account.");
  }

  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD is required to seed the first admin account.");
  }

  const existingAdmin = await db.query.user.findFirst({
    where: eq(user.email, adminEmail),
  });

  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      await db.update(user).set({ role: "admin" }).where(eq(user.id, existingAdmin.id));
      console.log(`Updated ${adminEmail} to admin.`);
    } else {
      console.log(`Admin account ${adminEmail} already exists.`);
    }

    return;
  }

  await createCredentialUser({
    email: adminEmail,
    password: adminPassword,
    name: adminName,
    role: "admin",
  });

  console.log(`Created admin account ${adminEmail}.`);
}

main()
  .finally(async () => {
    await Promise.all([closeQueues(), db.$client.end()]);
  })
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
