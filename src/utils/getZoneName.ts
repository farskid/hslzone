import { Zone } from "../types";

export function getZoneName(name: Zone) {
  switch (name) {
    case "OUT_OF_ZONES":
      return "-";
    case "A":
    case "B":
    case "C":
    case "D":
    default:
      return name;
  }
}
