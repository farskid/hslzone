import NotificationsIOS from "react-native-notifications";
import { PushNotificationPermissions } from "react-native";

function requestNotificationPermission() {
  return NotificationsIOS.requestPermissions(["alert"]);
}

export function sendNotification(title: string, message: string) {
  NotificationsIOS.checkPermissions()
    .then((perms: PushNotificationPermissions) => {
      if (perms === undefined || Object.values(perms).some(x => !x)) {
        requestNotificationPermission()
          .then((p: any) => {
            NotificationsIOS.localNotification({
              alertBody: message,
              alertTitle: title
            });
          })
          .catch((err: any) => {
            console.log(
              "Notification Request Permission | Send Local notification error"
            );
            console.error({ err });
          });
      } else {
        NotificationsIOS.localNotification({
          alertBody: message,
          alertTitle: title
        });
      }
    })
    .catch((err: any) => {
      console.log("Notification Permission error");
      console.error({ err });
    });
}
