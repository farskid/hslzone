import React from "react";
import { TouchableHighlight, Text, ViewStyle } from "react-native";
import { colors } from "./styles";

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ text, onClick, disabled = false, style = {} }: Props) {
  return (
    <TouchableHighlight
      style={{
        ...style,
        opacity: disabled ? 0.5 : 1,
        backgroundColor: colors.accent,
        borderRadius: 4,
        paddingVertical: 20,
        paddingHorizontal: 40
      }}
      onPress={onClick}
      disabled={disabled}
    >
      <Text
        style={{
          color: colors.white,
          fontWeight: "bold",
          fontSize: 20,
          textAlign: "center"
        }}
      >
        {text}
      </Text>
    </TouchableHighlight>
  );
}
