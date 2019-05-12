import React from "react";
import { Zone } from "../types";
import { getZoneName } from "../utils/getZoneName";

type Props = {
  name: Zone;
};

export function PublicZone({ name }: Props) {
  return <span>{getZoneName(name)}</span>;
}
