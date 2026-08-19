import type { UIMessage } from "ai";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../database/client";
import { chatMessage, chatSession } from "../database/schema";

export function serializeChatSession(record: typeof chatSession.$inferSelect) {
  return {
    id: record.id,
    userId: record.userId,
    title: record.title,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function serializeChatMessage(record: typeof chatMessage.$inferSelect) {
  return {
    id: record.id,
    sessionId: record.sessionId,
    role: record.role as "user" | "assistant",
    content: record.content,
    metadata: record.metadata,
    createdAt: record.createdAt.toISOString(),
  };
}

export function toUIMessage(record: typeof chatMessage.$inferSelect): UIMessage {
  return {
    id: record.id,
    role: record.role as "user" | "assistant",
    parts: [{ type: "text", text: record.content }],
  };
}

export function getTextFromUIMessage(message: UIMessage) {
  return message.parts
    .filter((part): part is Extract<UIMessage["parts"][number], { type: "text" }> => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
}

export async function findOrCreateAdminChatSession(userId: string) {
  const existing = await db
    .select()
    .from(chatSession)
    .where(eq(chatSession.userId, userId))
    .orderBy(desc(chatSession.updatedAt))
    .limit(1);

  if (existing[0]) {
    return existing[0];
  }

  const now = new Date();
  const id = crypto.randomUUID();
  const [created] = await db
    .insert(chatSession)
    .values({
      id,
      userId,
      title: null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return created;
}

export async function listChatMessages(sessionId: string) {
  return db
    .select()
    .from(chatMessage)
    .where(eq(chatMessage.sessionId, sessionId))
    .orderBy(asc(chatMessage.createdAt));
}

export async function touchChatSession(sessionId: string) {
  await db
    .update(chatSession)
    .set({ updatedAt: new Date() })
    .where(eq(chatSession.id, sessionId));
}

export async function insertChatMessage(input: {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  id?: string;
  metadata?: Record<string, unknown> | null;
}) {
  const now = new Date();
  const [created] = await db
    .insert(chatMessage)
    .values({
      id: input.id ?? crypto.randomUUID(),
      sessionId: input.sessionId,
      role: input.role,
      content: input.content,
      metadata: input.metadata ?? null,
      createdAt: now,
    })
    .returning();

  await touchChatSession(input.sessionId);

  return created;
}

export async function chatMessageExists(sessionId: string, messageId: string) {
  const rows = await db
    .select({ id: chatMessage.id })
    .from(chatMessage)
    .where(and(eq(chatMessage.sessionId, sessionId), eq(chatMessage.id, messageId)))
    .limit(1);

  return rows.length > 0;
}
