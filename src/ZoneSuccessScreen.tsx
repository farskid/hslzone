import React from "react";
import { Page } from "./Page";
import { PublicZone } from "./Zone";
import { Button } from "./Button";
import { View, Text, Platform } from "react-native";
import { colors } from "./styles";

type Props = {
  state: any;
  onRefresh: () => void;
  onWatchLocation: () => void;
};
export function ZoneSuccessScreen({
  state,
  onRefresh,
  onWatchLocation
}: Props) {
  const { zone } = state.context;
  const isWatching = state.matches({
    ready: { zone_available: "watching" }
  });
  return (
    <Page alignment="Bottom">
      <View
        style={{
          marginBottom: 128,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {zone !== undefined ? (
          <Text
            style={{ textAlign: "center", color: colors.white, fontSize: 30 }}
          >
            Your zone is{" "}
            <PublicZone
              name={zone}
              style={{
                color: colors.success,
                fontSize: 60,
                fontWeight: "bold",
                fontStyle: "italic"
              }}
            />
          </Text>
        ) : null}
        {isWatching ? (
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              color: colors.accent,
              marginTop: 16
            }}
          >
            Watching live location...
          </Text>
        ) : null}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          width: "100%",
          paddingBottom: 100
        }}
      >
        <Button
          style={{ marginBottom: 12, width: "80%" }}
          onClick={() => {
            onRefresh();
          }}
          text="Refresh"
        />
        <Button
          style={{ width: "80%" }}
          onClick={() => {
            onWatchLocation();
          }}
          disabled={isWatching}
          text="Watch for live zone changes"
        />
      </View>
    </Page>
  );
}
