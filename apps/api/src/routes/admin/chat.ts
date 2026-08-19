import { handleChatStream } from "@mastra/ai-sdk";
import { createUIMessageStreamResponse, readUIMessageStream, type UIMessage } from "ai";
import { Hono } from "hono";
import { ADMIN_ASSISTANT_AGENT_ID, mastra } from "../../mastra";
import { getAdminSession } from "../../shared/admin-session";
import {
  chatMessageExists,
  findOrCreateAdminChatSession,
  getTextFromUIMessage,
  insertChatMessage,
  listChatMessages,
  serializeChatMessage,
  serializeChatSession,
} from "../../shared/admin-chat";
import { createRateLimitMiddleware } from "../../server/rate-limit";

type ChatMessagesBody = {
  messages?: unknown;
};

const chatRateLimit = createRateLimitMiddleware({
  name: "admin-chat",
  limit: 30,
  windowMs: 60_000,
  methods: ["POST"],
});

export const adminChatRoutes = new Hono();

adminChatRoutes.get("/api/admin/chat/session", async (c) => {
  const auth = await getAdminSession(c.req.raw);

  if ("error" in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  const session = await findOrCreateAdminChatSession(auth.sessionUser.id);

  return c.json({ session: serializeChatSession(session) });
});

adminChatRoutes.get("/api/admin/chat/session/messages", async (c) => {
  const auth = await getAdminSession(c.req.raw);

  if ("error" in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  const session = await findOrCreateAdminChatSession(auth.sessionUser.id);
  const messages = await listChatMessages(session.id);

  return c.json({
    session: serializeChatSession(session),
    messages: messages.map(serializeChatMessage),
  });
});

adminChatRoutes.post("/api/admin/chat/session/messages", chatRateLimit, async (c) => {
  const auth = await getAdminSession(c.req.raw);

  if ("error" in auth) {
    return c.json({ error: auth.error }, auth.status);
  }

  let body: ChatMessagesBody;

  try {
    body = (await c.req.json()) as ChatMessagesBody;
  } catch {
    return c.json({ error: "Invalid JSON body." }, 400);
  }

  const messages = body.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return c.json({ error: "messages array is required." }, 400);
  }

  const uiMessages = messages as UIMessage[];
  const session = await findOrCreateAdminChatSession(auth.sessionUser.id);
  const lastUserMessage = [...uiMessages].reverse().find((message) => message.role === "user");

  if (lastUserMessage) {
    const content = getTextFromUIMessage(lastUserMessage);

    if (content.length > 0) {
      const exists = await chatMessageExists(session.id, lastUserMessage.id);

      if (!exists) {
        await insertChatMessage({
          id: lastUserMessage.id,
          sessionId: session.id,
          role: "user",
          content,
        });
      }
    }
  }

  try {
    const chunkStream = await handleChatStream({
      mastra,
      agentId: ADMIN_ASSISTANT_AGENT_ID,
      params: { messages: uiMessages as never },
      version: "v6",
    });

    const [clientStream, persistStream] = chunkStream.tee();

    void (async () => {
      try {
        let responseMessage: UIMessage | undefined;

        for await (const message of readUIMessageStream({
          stream: persistStream as ReadableStream<never>,
        })) {
          responseMessage = message;
        }

        if (responseMessage?.role === "assistant") {
          const content = getTextFromUIMessage(responseMessage);

          if (content.length > 0) {
            await insertChatMessage({
              id: responseMessage.id,
              sessionId: session.id,
              role: "assistant",
              content,
            });
          }
        }
      } catch (error) {
        console.error("Failed to persist admin assistant message.", error);
      }
    })();

    return createUIMessageStreamResponse({ stream: clientStream as ReadableStream<never> });
  } catch (error) {
    console.error("Admin chat stream failed.", error);

    return c.json({ error: "Assistant is unavailable. Try again later." }, 503);
  }
});
