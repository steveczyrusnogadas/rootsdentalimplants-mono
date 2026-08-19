import {
  AssistantModalPrimitive,
  ComposerPrimitive,
  MessagePartPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { Button } from "@repo/ui/components/button";
import { ChevronDownIcon, MessageCircleIcon, SendIcon, SquareIcon } from "lucide-react";

function AdminChatThread() {
  return (
    <ThreadPrimitive.Root className="flex h-full min-h-0 flex-col bg-background">
      <ThreadPrimitive.Viewport className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5">
        <ThreadPrimitive.Empty>
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-muted-foreground">
            <MessageCircleIcon className="size-8 opacity-50" />
            <p>Ask the admin assistant anything.</p>
          </div>
        </ThreadPrimitive.Empty>
        <ThreadPrimitive.Messages
          components={{
            UserMessage: () => (
              <MessagePrimitive.Root className="mb-4 flex justify-end">
                <div className="max-w-[90%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  <MessagePrimitive.Parts
                    components={{
                      Text: () => (
                        <MessagePartPrimitive.Text className="whitespace-pre-wrap" />
                      ),
                    }}
                  />
                </div>
              </MessagePrimitive.Root>
            ),
            AssistantMessage: () => (
              <MessagePrimitive.Root className="mb-4 flex justify-start">
                <div className="max-w-[90%] rounded-2xl rounded-bl-md border bg-card px-4 py-2.5 text-sm">
                  <MessagePrimitive.Parts
                    components={{
                      Text: MarkdownText,
                    }}
                  />
                </div>
              </MessagePrimitive.Root>
            ),
          }}
        />
        <ThreadPrimitive.ScrollToBottom asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-8 bottom-28 size-8 rounded-full shadow-sm"
          >
            <span className="sr-only">Scroll to bottom</span>
            <ChevronDownIcon className="size-4" />
          </Button>
        </ThreadPrimitive.ScrollToBottom>
      </ThreadPrimitive.Viewport>
      <ComposerPrimitive.Root className="border-t bg-background px-5 py-4">
        <div className="flex items-end gap-2">
          <ComposerPrimitive.Input
            placeholder="Message assistant..."
            className="max-h-40 min-h-12 flex-1 resize-none rounded-xl border bg-muted/40 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            rows={2}
          />
          <ComposerPrimitive.Send asChild>
            <Button type="button" size="icon" className="shrink-0 rounded-full">
              <SendIcon className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </ComposerPrimitive.Send>
          <ComposerPrimitive.Cancel asChild>
            <Button type="button" size="icon" variant="outline" className="shrink-0 rounded-full">
              <SquareIcon className="size-4" />
              <span className="sr-only">Stop</span>
            </Button>
          </ComposerPrimitive.Cancel>
        </div>
      </ComposerPrimitive.Root>
    </ThreadPrimitive.Root>
  );
}

export function AdminChatModal() {
  return (
    <AssistantModalPrimitive.Root>
      <AssistantModalPrimitive.Anchor className="fixed right-6 bottom-6 z-50">
        <AssistantModalPrimitive.Trigger asChild>
          <Button type="button" size="icon" className="size-16 rounded-full shadow-lg">
            <MessageCircleIcon className="size-7" />
            <span className="sr-only">Open assistant</span>
          </Button>
        </AssistantModalPrimitive.Trigger>
      </AssistantModalPrimitive.Anchor>
      <AssistantModalPrimitive.Content
        side="top"
        align="end"
        className="z-50 flex h-[min(48rem,calc(100svh-4rem))] w-[min(40rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border bg-background p-0 shadow-2xl"
      >
        <div className="border-b px-5 py-4">
          <h2 className="text-base font-semibold">Admin Assistant</h2>
          <p className="text-sm text-muted-foreground">Generic admin help assistant</p>
        </div>
        <div className="relative min-h-0 flex-1">
          <AdminChatThread />
        </div>
      </AssistantModalPrimitive.Content>
    </AssistantModalPrimitive.Root>
  );
}
