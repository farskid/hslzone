import zoneData from "../zoneData.json";

import { Point, Zone, ZoneData, Polygon } from "../types";

export function detectZone(point: Point): Zone {
  if (isInZoneA(point, zoneData)) {
    return "A";
  } else if (isInZoneB(point, zoneData)) {
    return "B";
  } else if (isInZoneC(point, zoneData)) {
    return "C";
  } else if (isInZoneD(point, zoneData)) {
    return "D";
  } else {
    return "OUT_OF_ZONES";
  }
}

function isInZoneA(point: Point, zoneData: ZoneData) {
  return isPointInPolygon(point, zoneData.A);
}

function isInZoneB(point: Point, zoneData: ZoneData) {
  return isPointInPolygon(point, zoneData.B);
}

function isInZoneC(point: Point, zoneData: ZoneData) {
  return isPointInPolygon(point, zoneData.C);
}

function isInZoneD(point: Point, zoneData: ZoneData) {
  return (
    isPointInPolygon(point, zoneData.D1) || isPointInPolygon(point, zoneData.D2)
  );
}

function isPointInPolygon(p: Point, polygon: Polygon) {
  let isInside = false;
  const initialPoint = polygon[0];
  let minX = initialPoint[0];
  let maxX = initialPoint[0];
  let minY = initialPoint[1];
  let maxY = initialPoint[1];

  for (let n = 1; n < polygon.length; n++) {
    const q = polygon[n];
    minX = Math.min(q[0], minX);
    maxX = Math.max(q[0], maxX);
    minY = Math.min(q[1], minY);
    maxY = Math.max(q[1], maxY);
  }

  if (p[0] < minX || p[0] > maxX || p[1] < minY || p[1] > maxY) {
    return false;
  }

  let i = 0;
  let j = polygon.length - 1;
  for (; i < polygon.length; j = i++) {
    if (
      polygon[i][1] > p[1] != polygon[j][1] > p[1] &&
      p[0] <
        ((polygon[j][0] - polygon[i][0]) * (p[1] - polygon[i][1])) /
          (polygon[j][1] - polygon[i][1]) +
          polygon[i][0]
    ) {
      isInside = !isInside;
    }
  }

  return isInside;
}
