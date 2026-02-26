//Tiffany Santiago Garcia
// Settings screen with link to archived tasks and other potential future settings options

import React from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 20, gap: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>
          Settings
        </Text>

        <Link href="/archived" asChild>
          <Pressable
            style={{
              padding: 14,
              borderWidth: 1,
              borderRadius: 12,
            }}
          >
            <Text style={{ fontWeight: "800" }}>
              View Archived Tasks
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
