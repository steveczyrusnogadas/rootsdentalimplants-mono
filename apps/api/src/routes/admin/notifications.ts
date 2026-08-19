import { Hono } from "hono";
import { adminAndManagerRoles, getAdminSession } from "../../shared/admin-session";
import {
  countUnreadAdminNotifications,
  listAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  serializeAdminNotification,
} from "../../notifications/service";
import { subscribeToAdminNotifications } from "../../notifications/realtime";
import { getAdminSettings } from "../../settings/admin-settings";

export const adminNotificationRoutes = new Hono();

adminNotificationRoutes.get("/api/admin/notifications", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const limitParam = Number(c.req.query("limit") ?? "20");
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;
  const settings = await getAdminSettings(admin.sessionUser.id);

  if (!settings.inAppAlerts) {
    return c.json({
      notifications: [],
      unreadCount: 0,
    });
  }

  const [notifications, unreadCount] = await Promise.all([
    listAdminNotifications(limit),
    countUnreadAdminNotifications(),
  ]);

  return c.json({
    notifications: notifications.map(serializeAdminNotification),
    unreadCount,
  });
});

adminNotificationRoutes.get("/api/admin/notifications/stream", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const encoder = new TextEncoder();
  let subscription: ReturnType<typeof subscribeToAdminNotifications> | null = null;
  let heartbeat: ReturnType<typeof setInterval> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };
      const close = () => {
        if (heartbeat) {
          clearInterval(heartbeat);
          heartbeat = null;
        }

        if (subscription) {
          void subscription.close();
          subscription = null;
        }
      };

      send("ready", { ok: true });
      void getAdminSettings(admin.sessionUser.id).then((settings) => {
        if (!settings.inAppAlerts) {
          return;
        }

        subscription = subscribeToAdminNotifications((notification) => {
          send("notification", notification);
        });
      });
      heartbeat = setInterval(() => {
        send("ping", { now: new Date().toISOString() });
      }, 30000);
      c.req.raw.signal.addEventListener("abort", close, { once: true });
    },
    cancel() {
      if (heartbeat) {
        clearInterval(heartbeat);
      }

      if (subscription) {
        void subscription.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
});

adminNotificationRoutes.patch("/api/admin/notifications/:id/read", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  const notification = await markAdminNotificationRead(c.req.param("id"));

  if (!notification) {
    return c.json({ error: "Notification not found." }, 404);
  }

  return c.json({ notification: serializeAdminNotification(notification) });
});

adminNotificationRoutes.post("/api/admin/notifications/read-all", async (c) => {
  const admin = await getAdminSession(c.req.raw, { roles: adminAndManagerRoles });

  if ("error" in admin) {
    return c.json({ error: admin.error }, admin.status);
  }

  await markAllAdminNotificationsRead();

  return c.json({ ok: true });
});
