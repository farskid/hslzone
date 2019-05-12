export type Point = number[];
export type Polygon = Point[];
export type InternalZones = "A" | "B" | "C" | "D1" | "D2";
export type Zone = "A" | "B" | "C" | "D" | "OUT_OF_ZONES";
export type ZoneData = { [z in InternalZones]: Polygon };
export type ZoneStatus = "Idle" | "Pending" | "Success" | "Error";
export type ZoneWatchState = "Not_Watching" | "Watching";
// Not available is a state of not supported Notification api
export type NotificationState = NotificationPermission | "NOT_AVAILABLE";
export interface ZoneState {
  error: PositionError | undefined;
  zone: Zone | undefined;
  zoneState: ZoneStatus;
  zoneWatchState: ZoneWatchState;
  zoneWatchId: number | undefined;
  notificationState: NotificationState;
}
export type ZoneEvents =
  | { type: "DETECT_LOCATION" }
  | { type: "SET_ZONE"; payload: { zone: Zone } }
  | { type: "SET_ZONE_ERROR"; payload: { error: PositionError } }
  | { type: "WATCH_LOCATION" }
  | { type: "SET_WATCH_ID"; payload: { watchId: number } }
  | { type: "REQUEST_FOR_NOTIFICATION_PERMISSION" }
  | {
      type: "SET_NOTIFICATION_PERMISSION";
      payload: { permission: NotificationState };
    };
