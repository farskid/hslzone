import { Point } from "./types";

export function getCurrentLocation(
  success: (p: Point) => void,
  fail: (error: PositionError) => void
) {
  if (!navigator || !navigator.geolocation) {
    window.alert("This feature is not available in your device");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    ({ coords: { latitude, longitude } }) => {
      success([longitude, latitude]);
    },
    fail
  );
}

export function watchCurrentLocation(
  success: (p: Point) => void,
  fail: (error: PositionError) => void
) {
  navigator.geolocation.watchPosition(({ coords: { latitude, longitude } }) => {
    success([longitude, latitude]);
  }, fail);
}
