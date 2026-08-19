import { Mastra } from "@mastra/core/mastra";
import { adminAssistantAgent } from "./agents/admin-assistant";

export const mastra = new Mastra({
  agents: {
    adminAssistant: adminAssistantAgent,
  },
});

export const ADMIN_ASSISTANT_AGENT_ID = "adminAssistant";
