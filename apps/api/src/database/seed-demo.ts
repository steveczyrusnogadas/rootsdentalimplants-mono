import "dotenv/config";
import type { BlogContent } from "@repo/types/admin/blog";
import type { DemoSeedResult } from "@repo/types/admin/seed";
import { inArray, eq } from "drizzle-orm";
import { createCredentialUser } from "../shared/create-credential-user";
import { db } from "./client";
import { seedLocations } from "./seed-locations";
import { blogPost, lead, user } from "./schema";

const demoPassword = process.env.DEMO_PASSWORD ?? "demo-password-123";
const shouldReset = process.argv.includes("--reset");

const demoUsers = [
  {
    name: "Demo Admin",
    email: "demo.admin@example.com",
    role: "admin" as const,
  },
  {
    name: "Demo Manager",
    email: "demo.manager@example.com",
    role: "manager" as const,
  },
];

const demoLeads = [
  {
    name: "Avery Stone",
    email: "avery@example.com",
    phone: "+1 555 0101",
    message: "We are evaluating a new customer portal and would like a product walkthrough.",
    status: "new",
    priority: "urgent",
    internalNotes: "Follow up this week with pricing options.",
  },
  {
    name: "Mina Patel",
    email: "mina@example.com",
    phone: "+1 555 0102",
    message: "Interested in a migration plan for an existing internal dashboard.",
    status: "qualified",
    priority: "high",
    internalNotes: "Asked about timeline and data import support.",
  },
  {
    name: "Jordan Lee",
    email: "jordan@example.com",
    phone: null,
    message: "Can you share more about the starter's admin workflows?",
    status: "contacted",
    priority: "normal",
    internalNotes: null,
  },
] as const;

const demoPosts = [
  {
    title: "Launching A Better Project Baseplate",
    slug: "launching-a-better-project-baseplate",
    excerpt: "A short overview of the conventions included in this starter.",
    authorName: "Baseplate Team",
    category: "Product",
    tags: ["starter", "typescript", "admin"],
    status: "published",
  },
  {
    title: "How The Admin Dashboard Is Structured",
    slug: "how-the-admin-dashboard-is-structured",
    excerpt: "A practical tour of the dashboard, routing, and data loading patterns.",
    authorName: "Baseplate Team",
    category: "Engineering",
    tags: ["admin", "react", "hono"],
    status: "draft",
  },
] as const;

function paragraphContent(text: string): BlogContent {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

async function resetDemoContent() {
  await db.delete(lead).where(eq(lead.source, "demo"));
  await db.delete(blogPost).where(
    inArray(
      blogPost.slug,
      demoPosts.map((post) => post.slug),
    ),
  );
  await db.delete(user).where(
    inArray(
      user.email,
      demoUsers.map((demoUser) => demoUser.email),
    ),
  );
}

async function seedDemoUsers() {
  let count = 0;

  for (const demoUser of demoUsers) {
    const record = await createCredentialUser({
      email: demoUser.email,
      password: demoPassword,
      name: demoUser.name,
      role: demoUser.role,
    });

    await db
      .update(user)
      .set({
        name: demoUser.name,
        role: demoUser.role,
        updatedAt: new Date(),
      })
      .where(eq(user.id, record.id));

    count += 1;
  }

  return count;
}

async function seedDemoLeads() {
  const now = new Date();

  await db.delete(lead).where(eq(lead.source, "demo"));
  await db.insert(lead).values(
    demoLeads.map((demoLead, index) => ({
      id: crypto.randomUUID(),
      name: demoLead.name,
      email: demoLead.email,
      phone: demoLead.phone,
      message: demoLead.message,
      status: demoLead.status,
      priority: demoLead.priority,
      source: "demo",
      internalNotes: demoLead.internalNotes,
      archivedAt: null,
      createdAt: new Date(now.getTime() - index * 86_400_000),
      updatedAt: now,
    })),
  );

  return demoLeads.length;
}

async function seedDemoPosts() {
  const now = new Date();

  await db.delete(blogPost).where(
    inArray(
      blogPost.slug,
      demoPosts.map((post) => post.slug),
    ),
  );
  await db.insert(blogPost).values(
    demoPosts.map((post, index) => ({
      id: crypto.randomUUID(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      authorName: post.authorName,
      category: post.category,
      tags: [...post.tags],
      seoTitle: null,
      seoDescription: null,
      coverImage: null,
      coverImageKey: null,
      status: post.status,
      content: paragraphContent(post.excerpt),
      publishedAt: post.status === "published" ? new Date(now.getTime() - index * 86_400_000) : null,
      createdAt: new Date(now.getTime() - index * 86_400_000),
      updatedAt: now,
    })),
  );

  return demoPosts.length;
}

async function main() {
  if (shouldReset) {
    await resetDemoContent();
  }

  const result: DemoSeedResult = {
    users: await seedDemoUsers(),
    leads: await seedDemoLeads(),
    blogPosts: await seedDemoPosts(),
    locations: await seedLocations(),
    reset: shouldReset,
  };

  console.log(`Seeded demo content: ${JSON.stringify(result)}.`);
  console.log(`Demo password: ${demoPassword}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
