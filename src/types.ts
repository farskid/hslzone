import { Machine, assign } from "xstate";
export type Point = number[];
export type Polygon = Point[];
export type InternalZones = "A" | "B" | "C" | "D1" | "D2";
export type Zone = "A" | "B" | "C" | "D" | "OUT_OF_ZONES";
export type ZoneData = { [z in InternalZones]: Polygon };
export type ZoneStatus = "Idle" | "Pending" | "Success" | "Error";
export type ZoneWatchState = "not_watching" | "watching";
// Not available is a state of not supported Notification api
export type NotificationState = NotificationPermission | "NOT_AVAILABLE";
