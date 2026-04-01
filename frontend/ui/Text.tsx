/*  Author - Kayla Thornton
    Purpose - Reusable text components to maintain consistency across pages in the app
 */

import React, { ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { COLORS, SPACING } from "./CustomStyles";

type variant = "error" | "caption";

interface TextProps{
    children: ReactNode,
    variant?: variant,
    style?: object
}

// set styling for all Headings
export function Heading({children, style}: TextProps) {
    return(
        <Text style={[styles.heading, style]}>{children}</Text>
    );
}

export function Subheading({children, style}: TextProps) {
    return(
        <Text style={[styles.subheading, style]}>{children}</Text>
    );
}

// set style for text body, can also change text to represent captions or errors
export function BodyText({children, variant, style }: TextProps) {
    // default test style
    let type;

    switch (variant){
        case 'caption':
            type = {
                fontSize: 14,
                color: COLORS.blueSteel
            }
            break;
        case 'error':
            type = {
                fontSize: 14,
                color: COLORS.redAccent
            }
            break;
    }

    return(
        <Text style={[type, styles.bodyText, style]}>{children}</Text>
    )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 32, 
        fontWeight: 800,
        textAlign: 'center',
        color: COLORS.primaryBlue,
        padding: SPACING.sm,
        margin: SPACING.md
    },
    subheading: {
        fontSize: 24, 
        fontWeight: 500,
        textAlign: 'center',
        color: COLORS.blueSteel,
        padding: SPACING.sm,
        margin: SPACING.sm
    },
    bodyText: {
        fontSize: 16, 
        fontWeight: 400,
        color: COLORS.blueSteel,
        padding: SPACING.sm,
        margin: SPACING.xs
    }
})