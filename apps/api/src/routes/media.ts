import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../database/client";
import { mediaAsset } from "../database/schema";
import { createObjectDownloadUrl } from "../storage/s3";

export const mediaRoutes = new Hono();

mediaRoutes.get("/api/media/:id", async (c) => {
  const record = await db.query.mediaAsset.findFirst({
    where: eq(mediaAsset.id, c.req.param("id")),
  });

  if (!record) {
    return c.json({ error: "Media asset not found." }, 404);
  }

  try {
    const downloadUrl = await createObjectDownloadUrl(record.objectKey);

    return c.redirect(downloadUrl, 302);
  } catch (error) {
    console.error("Failed to create media download URL.", error);

    return c.json({ error: "Media asset not found." }, 404);
  }
});
