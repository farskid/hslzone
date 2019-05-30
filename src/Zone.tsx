import React from "react";
import { Zone } from "./types";
import { getZoneName } from "./utils/getZoneName";
import { Text, TextProperties } from "react-native";

type Props = {
  name: Zone;
};

export function PublicZone({ name, ...props }: Props & TextProperties) {
  return <Text {...props}>{getZoneName(name)}</Text>;
}
