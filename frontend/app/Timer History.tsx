import API_BASE_URL from "@/utils/config";
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TimerSession = {
  timer_id: number | string;
  user_id: number | string;
  task_id?: number | string | null;
  task_title?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  duration_minutes?: number | null;
  completed?: number;
  created_at?: string | null;
};

type TimerStats = {
  total_sessions: number;
  completed_sessions: number;
  total_focus_minutes: number;
  total_focus_time: string;
};

export default function TimerHistoryScreen() {
  const userId = 1; // FOR TESTING

  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [stats, setStats] = useState<TimerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTimerHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/timer/history/${userId}`);
      const data = await response.json();

      console.log("TIMER HISTORY status:", response.status);
      console.log("TIMER HISTORY data:", data);

      if (response.ok && data.success) {
        setStats(data.stats);
        setSessions(data.sessions ?? []);
      } else {
        setError(data.error || "Error fetching timer history");
        setStats(null);
        setSessions([]);
      }
    } catch (err) {
      console.log("Error fetching timer history:", err);
      setError("Error fetching timer history");
      setStats(null);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimerHistory();
  }, []);

  const completedSessions = useMemo(
    () => sessions.filter((s) => s.completed === 1),
    [sessions]
  );

  const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString();
  };

  return (
    <SafeAreaView style={styles.bg}>
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Timer History</Text>

        {loading ? (
          <Text style={styles.infoText}>Loading timer history...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Focus Summary</Text>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats?.total_sessions ?? 0}</Text>
                  <Text style={styles.statLabel}>Total Sessions</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{stats?.completed_sessions ?? 0}</Text>
                  <Text style={styles.statLabel}>Completed Sessions</Text>
                </View>

                <View style={styles.statCardWide}>
                  <Text style={styles.statValue}>{stats?.total_focus_time ?? "0h 0m"}</Text>
                  <Text style={styles.statLabel}>Total Focus Time</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Completed Sessions</Text>

              {completedSessions.length === 0 ? (
                <Text style={styles.infoText}>No completed timer sessions yet.</Text>
              ) : (
                completedSessions.map((session) => (
                  <View key={String(session.timer_id)} style={styles.sessionCard}>
                    <Text style={styles.sessionTitle}>
                      {session.task_title || "Untitled Task"}
                    </Text>

                    <Text style={styles.sessionLine}>
                      Duration: {session.duration_minutes ?? 0} min
                    </Text>
                    <Text style={styles.sessionLine}>
                      Started: {formatDateTime(session.start_time)}
                    </Text>
                    <Text style={styles.sessionLine}>
                      Ended: {formatDateTime(session.end_time)}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  screen: {
    padding: 20,
    gap: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9DCE3",
    padding: 18,
  },
  statCardWide: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9DCE3",
    padding: 18,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  sessionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9DCE3",
    padding: 18,
    gap: 6,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  sessionLine: {
    fontSize: 14,
    color: "#6B7280",
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 14,
    color: "crimson",
  },
});