import type { ChatMessage } from "@repo/types/admin/chat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { AssistantChatTransport, useChatRuntime } from "@assistant-ui/react-ai-sdk";
import type { UIMessage } from "ai";
import { useMemo } from "react";
import { fetchAdminChatMessages } from "@/lib/admin-chat";
import { adminChatKeys } from "@/lib/query-keys";
import { AdminChatModal } from "@/components/assistant-ui/admin-chat-thread";

function storedMessagesToUI(messages: ChatMessage[]): UIMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    parts: [{ type: "text", text: message.content }],
  }));
}

function AdminChatRuntime({ initialMessages }: { initialMessages: UIMessage[] }) {
  const queryClient = useQueryClient();
  const transport = useMemo(
    () =>
      new AssistantChatTransport({
        api: "/api/admin/chat/session/messages",
        credentials: "include",
      }),
    [],
  );

  const runtime = useChatRuntime({
    messages: initialMessages,
    transport,
    onFinish: () => {
      void queryClient.invalidateQueries({ queryKey: adminChatKeys.messages() });
    },
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AdminChatModal />
    </AssistantRuntimeProvider>
  );
}

export function AdminChatWidget() {
  const { data, isLoading, isError } = useQuery({
    queryKey: adminChatKeys.messages(),
    queryFn: fetchAdminChatMessages,
  });

  if (isLoading || isError || !data) {
    return null;
  }

  const initialMessages = storedMessagesToUI(data.messages);

  return <AdminChatRuntime key={data.session.id} initialMessages={initialMessages} />;
}
