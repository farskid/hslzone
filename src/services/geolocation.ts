import { Point } from "../types";

export function detectLocationSupport() {
  return "navigator" in window && "geolocation" in window.navigator;
}

export function getCurrentLocation(
  success: (p: Point) => void,
  fail: (error: PositionError) => void
) {
  setTimeout(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        success([longitude, latitude]);
      },
      err => {
        console.log(err);
        fail(err);
      }
    );
  }, 1500);
}

export function watchCurrentLocation(
  success: (p: Point) => void,
  fail: (error: PositionError) => void
) {
  return navigator.geolocation.watchPosition(
    ({ coords: { latitude, longitude } }) => {
      success([longitude, latitude]);
    },
    fail
  );
}

export function clearLocationWatch(watchId: number) {
  navigator.geolocation.clearWatch(watchId);
}
