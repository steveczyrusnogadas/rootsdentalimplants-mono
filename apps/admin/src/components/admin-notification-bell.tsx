import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { BellIcon } from "lucide-react";
import type { AdminSettingsResponse } from "@repo/types/admin/settings";
import { adminApi, resolveApiUrl } from "@/lib/api";
import { adminLeadKeys, adminNotificationKeys, settingsKeys } from "@/lib/query-keys";

type AdminNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown>;
  readAt: string | null;
  createdAt: string;
};

type AdminNotificationsResponse = {
  notifications: AdminNotification[];
  unreadCount: number;
};

function formatNotificationTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function AdminNotificationBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const notificationsQuery = useQuery({
    queryKey: adminNotificationKeys.list(),
    queryFn: () =>
      adminApi<AdminNotificationsResponse>("/api/admin/notifications", {
        errorMessage: "Failed to load notifications.",
      }),
  });
  const settingsQuery = useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: () =>
      adminApi<AdminSettingsResponse>("/api/admin/settings", {
        errorMessage: "Failed to load settings.",
      }),
  });
  const markReadMutation = useMutation({
    mutationFn: async (notification: AdminNotification) => {
      await adminApi(`/api/admin/notifications/${notification.id}/read`, {
        method: "PATCH",
        errorMessage: "Failed to mark notification as read.",
      });

      return notification;
    },
    onSuccess: (notification) => {
      void queryClient.invalidateQueries({ queryKey: adminNotificationKeys.list() });

      if (notification.entityType === "lead") {
        void queryClient.invalidateQueries({ queryKey: adminLeadKeys.lists() });
      }
    },
  });
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await adminApi("/api/admin/notifications/read-all", {
        method: "POST",
        errorMessage: "Failed to mark notifications as read.",
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminNotificationKeys.list() });
    },
  });
  const notifications = notificationsQuery.data?.notifications ?? [];
  const unreadCount = notificationsQuery.data?.unreadCount ?? 0;
  const inAppAlerts = settingsQuery.data?.notifications.inAppAlerts ?? true;

  async function openNotification(notification: AdminNotification) {
    const leadId = notification.entityType === "lead" ? notification.entityId : null;

    await markReadMutation.mutateAsync(notification).catch(() => null);

    if (leadId) {
      await navigate({ to: "/leads/$leadId", params: { leadId } });
    }
  }

  useEffect(() => {
    if (!inAppAlerts) {
      return;
    }

    const events = new EventSource(resolveApiUrl("/api/admin/notifications/stream"), {
      withCredentials: true,
    });
    const handleNotification = () => {
      void queryClient.invalidateQueries({ queryKey: adminNotificationKeys.list() });
      void queryClient.invalidateQueries({ queryKey: adminLeadKeys.lists() });
    };

    events.addEventListener("notification", handleNotification);

    return () => {
      events.removeEventListener("notification", handleNotification);
      events.close();
    };
  }, [inAppAlerts, queryClient]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Open notifications"
        >
          <BellIcon className="size-4" />
          {unreadCount ? (
            <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-primary px-1 text-[10px] leading-4 text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 rounded-lg" align="end" sideOffset={4}>
        <div className="flex items-center justify-between gap-3">
          <DropdownMenuLabel className="normal-case tracking-normal">Notifications</DropdownMenuLabel>
          {unreadCount ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="mr-1"
              disabled={markAllReadMutation.isPending}
              onClick={() => markAllReadMutation.mutate()}
            >
              Mark all read
            </Button>
          ) : null}
        </div>
        <DropdownMenuSeparator />
        {notifications.length ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex cursor-pointer flex-col items-start gap-0.5 whitespace-normal font-normal normal-case tracking-normal"
              onClick={() => void openNotification(notification)}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="text-sm font-semibold leading-snug text-foreground">{notification.title}</span>
                {!notification.readAt ? <span className="size-2 shrink-0 rounded-full bg-primary" /> : null}
              </div>
              <span className="text-xs font-normal leading-snug text-muted-foreground">{notification.body}</span>
              <span className="text-[11px] font-normal tabular-nums leading-snug text-muted-foreground">
                {formatNotificationTime(notification.createdAt)}
              </span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">No notifications yet.</div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
