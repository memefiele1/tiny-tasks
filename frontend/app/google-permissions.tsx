import React from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

interface CalendarPermissionProps {
  onAllow?: () => void;
  onDecline?: () => void;
  isLoading?: boolean;
}

const CalendarPermissionScreen: React.FC<CalendarPermissionProps> = ({
  onAllow,
  onDecline,
  isLoading = false,
}) => {
  const router = useRouter();

  // Placeholder for Google OAuth integration
  const handleAllow = () => {
    // TODO: Integrate Google OAuth here
    if (onAllow) onAllow();
    // For now, just show loading for demo
  };

  const handleDecline = () => {
    if (onDecline) onDecline();
    else router.back(); // Or router.push("/next-screen")
  };

  return (
    <SafeAreaView style={styles.bg}>
      <View style={styles.centerWrap}>
        <View style={styles.card}>
          {/* Google Calendar Icon Placeholder */}
          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              {/* Replace with actual icon as needed */}
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 36, color: "#4285F4" }}>📅</Text>
              </View>
            </View>
          </View>
          <Text style={styles.title}>Connect your Google Calendar</Text>
          <Text style={styles.desc}>
            Tiny Tasks uses your Google Calendar to view upcoming events and help organize your tasks around your schedule.
          </Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What we access</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• View your calendar events</Text>
              <Text style={styles.listItem}>• Read your upcoming schedule</Text>
              <Text style={styles.listItem}>• Help plan tasks around deadlines and events</Text>
            </View>
          </View>
          <Text style={styles.privacy}>
            We will never edit or delete events without your permission.
          </Text>
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.primary, isLoading && styles.disabled]}
              onPress={handleAllow}
              disabled={isLoading}
              accessibilityLabel="Allow Google Calendar access"
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Allow access</Text>
              )}
            </Pressable>
            <Pressable
              style={[styles.button, styles.secondary]}
              onPress={handleDecline}
              accessibilityLabel="Decline Google Calendar access"
            >
              <Text style={[styles.buttonText, styles.secondaryText]}>Not now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#e3f0ff",
  },
  centerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    width: "90%",
    maxWidth: 370,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  iconWrap: {
    marginBottom: 18,
  },
  iconCircle: {
    backgroundColor: "#fff",
    borderRadius: 32,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4285F4",
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
    color: "#1a237e",
    letterSpacing: 0.2,
  },
  desc: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 18,
    marginTop: 0,
    lineHeight: 22,
  },
  section: {
    width: "100%",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
    color: "#1967D2",
    textAlign: "left",
  },
  list: {
    marginLeft: 8,
    marginTop: 2,
  },
  listItem: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 2,
    lineHeight: 22,
  },
  privacy: {
    fontSize: 13,
    color: "#607d8b",
    marginVertical: 10,
    textAlign: "center",
  },
  buttonRow: {
    width: "100%",
    marginTop: 8,
  },
  button: {
    width: "100%",
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  primary: {
    backgroundColor: "#4285F4",
  },
  secondary: {
    backgroundColor: "#f1f3f4",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  secondaryText: {
    color: "#1967D2",
  },
  disabled: {
    backgroundColor: "#b3cdfd",
    opacity: 0.7,
  },
});

export default CalendarPermissionScreen;
