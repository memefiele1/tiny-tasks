
//Tiffany Santiago Garcia
// Settings screen with link to archived tasks and other potential future settings options

import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.bg}>
      <View style={styles.screen}>
        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.section}>
  <Text style={styles.sectionLabel}>Account</Text>

  <Link href="/Archived" asChild>
    <Pressable style={styles.cardButton}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>View Archived Tasks</Text>
        <Text style={styles.cardSubtitle}>
          See tasks you’ve archived
        </Text>
      </View>
    </Pressable>
  </Link>

    <Link href="/Timer History" asChild>
      <Pressable style={styles.cardButton}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>View Timer History</Text>
          <Text style={styles.cardSubtitle}>
            See your focus sessions and total focus time
          </Text>
        </View>
      </Pressable>
    </Link>
  </View>

        {/* Future settings sections can be added here */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  screen: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cardButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9DCE3",
    padding: 0,
    marginBottom: 4,
    overflow: "hidden",
  },
  cardContent: {
    padding: 18,
    flexDirection: "column",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "400",
  },
});