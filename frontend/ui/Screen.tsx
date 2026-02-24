import React from "react";
import { ScrollView, View, ViewStyle, ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenProps extends ScrollViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: number;
  style?: ViewStyle;
}

/* Screen wrapper component */
export default function Screen({
  children,
  scrollable = false,
  padding = 20,
  style,
  ...scrollProps
}: ScreenProps) {
  const containerStyle: ViewStyle = {
    flex: 1,
    padding,
  };

  const content = <View style={[containerStyle, style]}>{children}</View>;

  if (scrollable) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          {...scrollProps}
        >
          {content}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return <SafeAreaView style={{ flex: 1 }}>{content}</SafeAreaView>;
}
