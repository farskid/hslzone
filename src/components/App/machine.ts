import { Machine, assign } from "xstate";
import { Zone } from "../../types";
import {
  getCurrentLocation,
  watchCurrentLocation,
  clearLocationWatch,
  detectLocationSupport
} from "../../services/geolocation";
import { detectZone } from "../../services/zone";

export type ZoneContext = {
  error: PositionError | undefined;
  zone: Zone | undefined;
};

export type ZoneEvents =
  | { type: "DETECT_ZONE" }
  | { type: "REFRESH" }
  | { type: "LOCATION_CHANGED" }
  | { type: "DETECT_ZONE" };

type ZoneStateSchema = {
  states: {
    location_pending: {};
    location_supported: {
      states: {
        zone_idle: {};
        zone_pending: {};
        zone_available: {
          states: {
            history: {};
            not_watching: {};
            watching: {};
          };
        };
        zone_error: {};
      };
    };
    location_not_supported: {};
  };
};

export const zoneMachine = Machine<ZoneContext>(
  {
    id: "zoneMachine",
    initial: "location_pending",
    context: { error: undefined, zone: undefined },
    states: {
      location_pending: {
        invoke: {
          src: "detectLocationSupport",
          id: "detectLocationSupport",
          onDone: {
            target: "location_supported"
          },
          onError: {
            target: "location_not_supported"
          }
        }
      },
      location_supported: {
        initial: "zone_idle",
        states: {
          zone_idle: {
            on: {
              DETECT_ZONE: {
                target: "zone_pending"
              }
            }
          },
          zone_pending: {
            invoke: {
              id: "detectZone",
              src: "detectZone",
              onDone: {
                target: "zone_available",
                actions: ["setZone"]
              },
              onError: {
                target: "zone_error",
                actions: ["setError"]
              }
            }
          },
          zone_available: {
            initial: "not_watching",
            on: {
              REFRESH: {
                target: "zone_pending"
              },
              LOCATION_CHANGED: {
                target: ".history",
                actions: ["setZone"]
              }
            },
            states: {
              history: {
                id: "history",
                type: "history",
                history: "shallow"
              },
              not_watching: {
                on: {
                  WATCH_LOCATION: {
                    target: "watching"
                  }
                }
              },
              watching: {
                invoke: {
                  id: "watchLocation",
                  src: "watchLocationService"
                }
              }
            }
          },
          zone_error: {
            on: {
              DETECT_ZONE: {
                target: "zone_pending"
              }
            }
          }
        }
      },
      location_not_supported: {
        type: "final"
      }
    }
  },
  {
    services: {
      detectLocationSupport: (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
          const isSupported = detectLocationSupport();
          if (isSupported) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      },
      detectZone: (): Promise<Zone> => {
        return new Promise((resolve, reject) => {
          getCurrentLocation(
            point => {
              const zone = detectZone(point);
              resolve(zone);
            },
            error => {
              reject(error);
            }
          );
        });
      },
      watchLocationService: (ctx, e) => (callback, onEvent) => {
        const watchId = watchCurrentLocation(
          point => {
            const newZone = detectZone(point);
            // Avoid unnecessary call to parent
            if (ctx.zone !== newZone) {
              callback({
                type: "LOCATION_CHANGED",
                data: detectZone(point)
              });
            }
          },
          err => {
            // noop (don't care about watch errors)
            console.error(err);
          }
        );
        return () => {
          clearLocationWatch(watchId);
        };
      }
    },
    actions: {
      setZone: assign({
        zone: (_, e) => e.data
      }),
      setError: assign({
        error: (_, e) => e.data
      })
    }
  }
);
