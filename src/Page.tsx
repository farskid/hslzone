import React from "react";
import { View } from "react-native";
import { colors } from "./styles";

enum VericalAlignment {
  Top = "flex-start",
  Middle = "center",
  Bottom = "flex-end"
}

type Props = {
  children: React.ReactNode;
  alignment?: keyof typeof VericalAlignment;
};

export function Page({ children, alignment = "Middle" }: Props) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: VericalAlignment[alignment],
        backgroundColor: colors.black,
        height: "100%",
        paddingBottom: 16
      }}
    >
      {children}
    </View>
  );
}
