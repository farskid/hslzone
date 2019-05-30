import React from "react";
import { useMachine } from "@xstate/react";
import { zoneMachine } from "./machine";
import { StateValue } from "xstate";
import { IdleScreen } from "./IdleScreen";
import { PendingScreen } from "./PendingScreen";
import { ZoneSuccessScreen } from "./ZoneSuccessScreen";
import { ErrorScreen } from "./ErrorScreen";
// import { detectZone } from "./services/zone";
// import { Point } from "./types";

function ViewForState({
  state,
  match,
  children
}: {
  state: any;
  match: StateValue;
  children: React.ReactNode;
}) {
  return <>{state.matches(match) ? children : null}</>;
}

// const MOCK_ZONES = {
//   A: [24.915668, 60.162614],
//   B: [24.825716, 60.187741],
//   C: [25.038163, 60.292933],
//   D: [24.468068, 60.123649]
// };

// function getRandomFromArray(array: Point[]) {
//   const len = array.length;
//   const rand = Math.floor(Math.random() * len);
//   return array[rand];
// }

export default function App() {
  const [state, sendEvent] = useMachine(zoneMachine, {
    devTools: true
  });
  // React.useEffect(() => {
  //   if (state.matches({ ready: { zone_available: "watching" } })) {
  //     let id: number = -1;
  //     id = setInterval(() => {
  //       sendEvent({
  //         type: "LOCATION_CHANGED",
  //         data: detectZone(getRandomFromArray(Object.values(MOCK_ZONES)))
  //       });
  //     }, 2000);
  //     return () => {
  //       clearInterval(id);
  //     };
  //   }
  //   return () => {};
  // }, [state.value]);
  return (
    <>
      <ViewForState state={state} match="preparing">
        <PendingScreen />
      </ViewForState>
      <ViewForState state={state} match="error">
        <h1 className="text-danger">
          Geolocation is not supported in your browser
        </h1>
      </ViewForState>
      <ViewForState state={state} match="ready">
        <ViewForState state={state} match={{ ready: "zone_idle" }}>
          <IdleScreen onZoneFind={() => sendEvent({ type: "DETECT_ZONE" })} />
        </ViewForState>
        <ViewForState state={state} match={{ ready: "zone_pending" }}>
          <PendingScreen />
        </ViewForState>
        <ViewForState state={state} match={{ ready: "zone_available" }}>
          <ZoneSuccessScreen
            state={state}
            onRefresh={() => sendEvent({ type: "REFRESH" })}
            onWatchLocation={() =>
              sendEvent({
                type: "WATCH_LOCATION"
              })
            }
          />
        </ViewForState>
        <ViewForState state={state} match={{ ready: "zone_error" }}>
          <ErrorScreen
            error={state.context.error}
            onRefresh={() => sendEvent({ type: "DETECT_ZONE" })}
          />
        </ViewForState>
      </ViewForState>
    </>
  );
}
