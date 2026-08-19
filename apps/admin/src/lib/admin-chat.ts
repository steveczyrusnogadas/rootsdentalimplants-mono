import type { ChatMessagesResponse } from "@repo/types/admin/chat";
import { adminApi } from "@/lib/api";

export async function fetchAdminChatMessages() {
  return adminApi<ChatMessagesResponse>("/api/admin/chat/session/messages", {
    errorMessage: "Failed to load chat history.",
  });
}
