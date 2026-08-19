import Redis from "ioredis";
import { getRedisUrl } from "../jobs/redis";
import type { serializeAdminNotification } from "./service";

const adminNotificationChannel = "admin.notifications";
let publisher: Redis | null = null;

type SerializedAdminNotification = ReturnType<typeof serializeAdminNotification>;

function getPublisher() {
  publisher ??= new Redis(getRedisUrl(), {
    maxRetriesPerRequest: 3,
  });

  return publisher;
}

export async function publishAdminNotification(notification: SerializedAdminNotification) {
  try {
    await getPublisher().publish(adminNotificationChannel, JSON.stringify(notification));
  } catch (error) {
    console.error("Failed to publish admin notification.", error);
  }
}

export function subscribeToAdminNotifications(onNotification: (notification: SerializedAdminNotification) => void) {
  const subscriber = new Redis(getRedisUrl(), {
    maxRetriesPerRequest: null,
  });

  subscriber.on("message", (_channel, message) => {
    try {
      onNotification(JSON.parse(message) as SerializedAdminNotification);
    } catch (error) {
      console.error("Failed to parse admin notification message.", error);
    }
  });

  void subscriber.subscribe(adminNotificationChannel);

  return {
    close: () => subscriber.quit(),
  };
}
