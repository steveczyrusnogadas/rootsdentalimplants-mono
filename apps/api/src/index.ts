import { app } from "./server/app";
import { ensureStorageBucket } from "./storage/s3";

void ensureStorageBucket().catch((error) => {
  console.error("Failed to ensure object storage bucket.", error);
});

export default {
  port: 3000,
  fetch(request: Request, server: Bun.Server<unknown>) {
    if (
      new URL(request.url).pathname === "/api/admin/notifications/stream" ||
      new URL(request.url).pathname === "/api/user/notifications/stream"
    ) {
      server.timeout(request, 0);
    }

    return app.fetch(request);
  },
};
