import React from "react";
import { Page } from "./Page";
import { Button } from "./Button";

function getError(error: any) {
  if (typeof error === "string") {
    return error as string;
  }

  if (error.message !== undefined) {
    return error.message as string;
  }

  return undefined;
}

type Props = {
  onRefresh: () => void;
  error?: any;
};
export function ErrorScreen({ onRefresh, error }: Props) {
  console.log(error);
  return (
    <Page>
      <h1 className="text-danger text-center mb-4 sm:mb-10">
        {getError(error) || "Something went wrong"}
      </h1>

      <Button onClick={() => onRefresh()} text="Try Again" />
    </Page>
  );
}
