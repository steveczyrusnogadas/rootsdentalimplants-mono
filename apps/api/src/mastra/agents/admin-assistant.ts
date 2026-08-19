import { Agent } from "@mastra/core/agent";

export const adminAssistantAgent = new Agent({
  id: "admin-assistant",
  name: "Admin Assistant",
  instructions: `You are a helpful assistant for internal admin users of this Baseplate platform.
Answer clearly and concisely. You do not have access to private application data or retrieval tools in this starter.
If asked about data you cannot see, say so rather than inventing facts.`,
  model: "openai/gpt-4o-mini",
});
