import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { zoneMachine, ZoneContext, ZoneEvents } from "./machine";
import { State, StateValue } from "xstate";
import { IdleScreen } from "./IdleScreen";
import { PendingScreen } from "./PendingScreen";
import { ZoneSuccessScreen } from "./ZoneSuccessScreen";
import { Debug } from "../Debug";
import { ErrorScreen } from "./ErrorScreen";
import { Viz } from "../Viz";
import "./App.css";

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

export default function App() {
  const [state, sendEvent, service] = useMachine(zoneMachine, {
    devTools: true
  });
  console.log(state);
  useEffect(() => {
    service.onEvent(e => {
      console.log(e);
    });
  }, []);
  const [modalShown, setModalShown] = React.useState(true);
  return (
    <>
      <aside className="sidebar">
        <Debug
          env={process.env.NODE_ENV}
          state={{ value: state.value, context: state.context }}
        >
          <button
            onClick={() => {
              setModalShown(true);
            }}
            className="bg-danger text-white font-bold py-2 px-2 mt-2 rounded"
          >
            open viz
          </button>
        </Debug>
      </aside>
      <Viz
        machine={zoneMachine}
        modalShown={modalShown}
        setModalShown={setModalShown}
      />
      <ViewForState state={state} match="location_pending">
        <PendingScreen>Detecting Geolocation support...</PendingScreen>
      </ViewForState>
      <ViewForState state={state} match="location_not_supported">
        <h1 className="text-danger">
          Geolocation is not supported in your browser
        </h1>
      </ViewForState>
      <ViewForState state={state} match="location_supported">
        <ViewForState state={state} match={{ location_supported: "zone_idle" }}>
          <IdleScreen onZoneFind={() => sendEvent({ type: "DETECT_ZONE" })} />
        </ViewForState>
        <ViewForState
          state={state}
          match={{ location_supported: "zone_pending" }}
        >
          <PendingScreen>Detecting your HSL zone...</PendingScreen>
        </ViewForState>
        <ViewForState
          state={state}
          match={{ location_supported: "zone_available" }}
        >
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
        <ViewForState
          state={state}
          match={{ location_supported: "zone_error" }}
        >
          <ErrorScreen
            error={state.context.error}
            onRefresh={() => sendEvent({ type: "DETECT_ZONE" })}
          />
        </ViewForState>
      </ViewForState>
    </>
  );
}
