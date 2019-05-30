export function logger<State, Events>(
  reducer: (state: State, events: Events) => State
) {
  const reducerWithLogger = (state: State, event: Events) => {
    console.log(
      "%cPrevious State:",
      "color: #9E9E9E; font-weight: 700;",
      state
    );
    console.log("%cAction:", "color: #00A7F7; font-weight: 700;", event);
    console.log(
      "%cNext State:",
      "color: #47B04B; font-weight: 700;",
      reducer(state, event)
    );
    return reducer(state, event);
  };
  return reducerWithLogger;
}
