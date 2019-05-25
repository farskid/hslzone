import React from "react";
import { StateChart } from "@statecharts/xstate-viz";
import { StateMachine } from "xstate";

type Props = {
  machine: StateMachine<any, any, any>;
  modalShown: boolean;
  setModalShown: (s: boolean) => void;
};

export function Viz({ machine, modalShown, setModalShown }: Props) {
  return modalShown ? (
    <div
      className="h-screen w-full fixed"
      style={{ top: 0, left: 0, zIndex: 1000 }}
    >
      <button
        className="absolute bg-danger text-white font-bold py-2 px-2 rounded"
        style={{ top: 15, right: 15 }}
        onClick={() => {
          setModalShown(false);
        }}
      >
        close
      </button>
      <StateChart machine={machine} />
    </div>
  ) : null;
}
