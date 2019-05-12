import { NotificationState } from "../types";

function isNotificationSupported() {
  return "Notification" in window;
}

export async function requestForNotificationPermission(): Promise<
  NotificationState
> {
  console.log("request for notif permission");
  if (!isNotificationSupported()) {
    console.log("notif not supported");
    return Promise.resolve("NOT_AVAILABLE");
  }
  return Notification.requestPermission();
}

export function sendNotification(title: string, body: string) {
  const notification = new Notification(title, {
    body,
    icon: "/images/favicon.ico"
  });
}
