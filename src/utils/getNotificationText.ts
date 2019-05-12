import { Zone } from "../types";

export function getNotificationText(zone: Zone) {
  switch (zone) {
    case "OUT_OF_ZONES":
      return "You're out of HSL Zones support!";
    case "A":
      return "You're in zone A";
    case "B":
      return "You're in zone B";
    case "C":
      return "You're in zone C";
    case "D":
      return "You're in zone D";
    default:
      throw Error("Invalid zone provided");
  }
}
