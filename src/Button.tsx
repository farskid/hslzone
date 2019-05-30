import React from "react";
import { TouchableHighlight, Text, ViewStyle, TextStyle } from "react-native";
import { colors } from "./styles";

type ButtonSize = "normal" | "large";
const buttonSizeStyles: {
  [key in ButtonSize]: { button: ViewStyle; text: TextStyle }
} = {
  normal: {
    button: { borderRadius: 4, paddingVertical: 20, paddingHorizontal: 40 },
    text: { fontSize: 20 }
  },
  large: {
    button: { borderRadius: 8, paddingVertical: 30, paddingHorizontal: 60 },
    text: { fontSize: 30 }
  }
};

type Props = {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  size?: ButtonSize;
};

export function Button({
  text,
  onClick,
  disabled = false,
  style = {},
  size = "normal"
}: Props) {
  return (
    <TouchableHighlight
      style={{
        ...style,
        opacity: disabled ? 0.5 : 1,
        backgroundColor: colors.accent,
        ...buttonSizeStyles[size].button
      }}
      onPress={onClick}
      disabled={disabled}
    >
      <Text
        style={{
          color: colors.white,
          fontWeight: "bold",
          textAlign: "center",
          ...buttonSizeStyles[size].text
        }}
      >
        {text}
      </Text>
    </TouchableHighlight>
  );
}
