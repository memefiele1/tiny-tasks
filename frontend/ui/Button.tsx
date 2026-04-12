import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

/**
 * Brand colors from the Georgia State media kit
 */
const COLORS = {
  primaryBlue: "#0039A6",
  white: "#FFFFFF",
  redAccent: "#CC0000",
  blueSteel: "#374057",
  vibrantBlue: "#00AEEF",
};

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
}

/** Button component  */
export default function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  testID,
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const isPrimary = variant === "primary";
  const isDisabled = disabled || loading;

  const buttonStyle: ViewStyle = {
    ...styles.button,
    backgroundColor: isPrimary
      ? isDisabled
        ? "#CCCCCC"
        : isPressed
          ? "#002966"
          : COLORS.primaryBlue
      : isDisabled
        ? "#F5F5F5"
        : isPressed
          ? "#E8F0FF"
          : COLORS.white,
    borderColor: isPrimary ? "transparent" : COLORS.primaryBlue,
    borderWidth: isPrimary ? 0 : 2,
    opacity: isDisabled ? 0.6 : 1,
  };

  const textStyle: TextStyle = {
    ...styles.text,
    color: isPrimary ? COLORS.white : COLORS.primaryBlue,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[buttonStyle, style]}
      testID={testID}
    >
      <Text style={textStyle}>
        {loading ? "Loading..." : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48, 
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
