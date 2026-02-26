import React from "react";
import { StyleSheet, Text } from "react-native";

const COLORS = {
  primaryBlue: "#0039A6",
  white: "#FFFFFF",
  redAccent: "#CC0000",
  blueSteel: "#374057",
  vibrantBlue: "#00AEEF",
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

interface TextProps {
    children: React.ReactNode,
    type: "default" | "error" | "caption",
    style: string
}

export function Heading({children}: TextProps) {
    return(
        <Text style={[styles.heading]}>{children}</Text>
    );
}

export function BodyText({children, type }: TextProps) {
    return(
        <Text style={[styles.bodyText]}>{children}</Text>
    )
}
const styles = StyleSheet.create({
    heading: {
        fontSize: 32, 
        fontWeight: 800,
        color: COLORS.blueSteel
    },
    subheading: {
        fontSize: 24, 
        fontWeight: 700
    },
    bodyText: {
        fontSize: 16, 
        fontWeight: 400
    }
})