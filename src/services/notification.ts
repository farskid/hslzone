import Notification from "react-native-push-notification";

export function sendNotification(title: string, body: string) {
  Notification.localNotification({
    title,
    message: body
  });
}
