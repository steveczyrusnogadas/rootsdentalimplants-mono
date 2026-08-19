import { boolean, doublePrecision, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import type { BlogContent } from "@repo/types/admin/blog";
import type { WeeklyHours } from "@repo/types/location";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    impersonatedBy: text("impersonated_by"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const twoFactor = pgTable("two_factor", {
  id: text("id").primaryKey(),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  verified: boolean("verified").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const lead = pgTable("lead", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  source: text("source").notNull(),
  internalNotes: text("internal_notes"),
  archivedAt: timestamp("archived_at"),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const contact = pgTable("contact", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  kind: text("kind").notNull(),
  source: text("source").notNull(),
  sourceLeadId: text("source_lead_id")
    .unique()
    .references(() => lead.id, { onDelete: "set null" }),
  notes: text("notes"),
  tags: jsonb("tags").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const domainEvent = pgTable("domain_event", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
  status: text("status").notNull(),
  attempts: integer("attempts").notNull(),
  error: text("error"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  processedAt: timestamp("processed_at"),
});

export const adminNotification = pgTable("admin_notification", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull(),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").notNull(),
});

export const adminSettings = pgTable("admin_settings", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  inAppAlerts: boolean("in_app_alerts").notNull().default(true),
  emailDigests: boolean("email_digests").notNull().default(false),
  emailOtpEnabled: boolean("email_otp_enabled").notNull().default(false),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const blogPost = pgTable("blog_post", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  authorName: text("author_name").notNull(),
  category: text("category"),
  tags: jsonb("tags").$type<string[]>().notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  coverImage: text("cover_image"),
  coverImageKey: text("cover_image_key"),
  status: text("status").notNull(),
  content: jsonb("content").$type<BlogContent>().notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const mediaAsset = pgTable("media_asset", {
  id: text("id").primaryKey(),
  fileName: text("file_name").notNull(),
  altText: text("alt_text"),
  assetType: text("asset_type").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  durationSeconds: integer("duration_seconds"),
  tags: jsonb("tags").$type<string[]>().notNull(),
  objectKey: text("object_key").notNull().unique(),
  url: text("url").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const adminAuditEvent = pgTable("admin_audit_event", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  actorUserId: text("actor_user_id").references(() => user.id, { onDelete: "set null" }),
  actorEmail: text("actor_email"),
  actorRole: text("actor_role"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const location = pgTable(
  "location",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    displayName: text("display_name").notNull(),
    street: text("street").notNull(),
    suite: text("suite"),
    city: text("city").notNull(),
    region: text("region").notNull(),
    postalCode: text("postal_code").notNull(),
    phone: text("phone").notNull(),
    weeklyHours: jsonb("weekly_hours").$type<WeeklyHours>().notNull(),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    sortOrder: integer("sort_order").notNull(),
    published: boolean("published").notNull().default(true),
    isDefaultCall: boolean("is_default_call").notNull().default(false),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("location_one_default_call")
      .on(table.isDefaultCall)
      .where(sql`${table.isDefaultCall} = true`),
    index("location_sort_order_idx").on(table.sortOrder),
  ],
);

export const chatSession = pgTable("chat_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: text("title"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const chatMessage = pgTable("chat_message", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => chatSession.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull(),
});
