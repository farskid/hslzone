import { NotificationState } from "../types";

function isNotificationSupported() {
  return "Notification" in window;
}

export async function requestForNotificationPermission(): Promise<
  NotificationState
> {
  if (!isNotificationSupported()) {
    return Promise.resolve("NOT_AVAILABLE");
  }
  return Notification.requestPermission();
}

export function sendNotification(title: string, body: string) {
  new Notification(title, {
    body,
    icon: "/images/favicon.ico"
  });
}
