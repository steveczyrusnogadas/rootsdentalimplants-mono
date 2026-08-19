import { z } from "zod";

export const chatMessageRoleSchema = z.enum(["user", "assistant"]);

export const chatMessageSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  role: chatMessageRoleSchema,
  content: z.string(),
  metadata: z.record(z.string(), z.unknown()).nullable(),
  createdAt: z.string(),
});

export const chatSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const chatSessionResponseSchema = z.object({
  session: chatSessionSchema,
});

export const chatMessagesResponseSchema = z.object({
  session: chatSessionSchema,
  messages: z.array(chatMessageSchema),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatSession = z.infer<typeof chatSessionSchema>;
export type ChatSessionResponse = z.infer<typeof chatSessionResponseSchema>;
export type ChatMessagesResponse = z.infer<typeof chatMessagesResponseSchema>;
