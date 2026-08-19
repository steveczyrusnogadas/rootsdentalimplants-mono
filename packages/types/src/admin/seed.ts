import { z } from "zod";

export const demoSeedResultSchema = z.object({
  users: z.number(),
  leads: z.number(),
  blogPosts: z.number(),
  locations: z.number(),
  reset: z.boolean(),
});

export type DemoSeedResult = z.infer<typeof demoSeedResultSchema>;
