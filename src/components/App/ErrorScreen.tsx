import React from "react";
import { Page } from "../Page";
import { Button } from "../Button";

type Props = {
  onRefresh: () => void;
};
export function ErrorScreen({ onRefresh }: Props) {
  return (
    <Page>
      <h1 className="text-danger text-center mb-4 sm:mb-10">
        Something went wrong
      </h1>

      <Button onClick={() => onRefresh()}>Try Again</Button>
    </Page>
  );
}
