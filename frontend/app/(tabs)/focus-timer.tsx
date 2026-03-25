import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { useTasks } from "../../context/TasksContext";
import { SafeAreaView } from "react-native-safe-area-context";

const FOCUS_DURATION = 25 * 60;

const priorityColors = {
  high: "#ff6b6b",
  medium: "#ffd166",
  low: "#6bcB77",
} as const;

export default function FocusTimerScreen() {
  const { tasks } = useTasks();

  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const priorityOrder = {
    high: 3,
    medium: 2,
    low: 1,
  } as const;

const parseTaskDateTime = (dueDate?: string, time?: string) => {
  if (!dueDate) return Number.MAX_SAFE_INTEGER;

  const baseDate = new Date(dueDate);
  if (Number.isNaN(baseDate.getTime())) return Number.MAX_SAFE_INTEGER;

  let hours = 23;
  let minutes = 59;

  if (time) {
    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

    if (match) {
      let hour = Number(match[1]);
      const minute = Number(match[2]);
      const period = match[3].toUpperCase();

      if (period === "AM" && hour === 12) hour = 0;
      if (period === "PM" && hour !== 12) hour += 12;

      hours = hour;
      minutes = minute;
    }
  }

  const combined = new Date(dueDate);
  combined.setHours(hours, minutes, 0, 0);

  return combined.getTime();
};

const activeTasks = useMemo(() => {
  return tasks.filter(
    (task) => task.status !== "completed" && task.status !== "deleted"
  );
}, [tasks]);

const sortedTasks = useMemo(() => {
  return [...activeTasks].sort((a, b) => {
    const dateTimeDiff =
      parseTaskDateTime(a.dueDate, a.time) - parseTaskDateTime(b.dueDate, b.time);

    if (dateTimeDiff !== 0) return dateTimeDiff;

    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}, [activeTasks]);

const currentTask = useMemo(() => {
  return sortedTasks[0] ?? null;
}, [sortedTasks]);

const upNext = useMemo(() => {
  if (!currentTask) return [];
  return sortedTasks.filter((task) => task.id !== currentTask.id).slice(0, 3);
}, [sortedTasks, currentTask]);


  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const progress = (FOCUS_DURATION - timeLeft) / FOCUS_DURATION;

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(FOCUS_DURATION);
  };

  return (
    <SafeAreaView style={styles.bg}>
      <View style={styles.screen}>
        <Text style={styles.headerTitle}>Focus Timer</Text>

        <View style={styles.taskCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.taskLabel}>Current Task</Text>
            <Text style={styles.taskTitle}>
              {currentTask ? currentTask.title : "No active task"}
            </Text>
            <Text style={styles.taskTime}>
              {currentTask?.time ?? "Add a task to get started"}
            </Text>
          </View>

          <View
            style={[
              styles.priorityDot,
              {
                backgroundColor: currentTask
                  ? priorityColors[currentTask.priority]
                  : "#D9DCE3",
              },
            ]}
          />
        </View>

        <View style={styles.timerWrap}>
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>

          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
            />
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.primaryButton} onPress={handleStartPause}>
              <Text style={styles.primaryButtonText}>
                {isRunning ? "Pause" : "Start"}
              </Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleReset}>
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.upNextTitle}>Up Next</Text>

        <View style={styles.upNextList}>
          {upNext.length === 0 ? (
            <Text style={styles.emptyText}>No upcoming tasks yet.</Text>
          ) : (
            upNext.map((task) => (
              <View key={task.id} style={styles.upNextCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.upNextTaskTitle}>{task.title}</Text>
                  <Text style={styles.upNextTaskTime}>
                    {task.time ? task.time : task.dueDate}
                  </Text>
                </View>

                <View
                  style={[
                    styles.upNextPriorityDot,
                    { backgroundColor: priorityColors[task.priority] },
                  ]}
                />
              </View>
            ))
          )}
        </View>
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
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9DCE3",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  taskLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  taskTime: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },
  priorityDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    marginLeft: 12,
  },
  timerWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9DCE3",
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  timerText: {
    fontSize: 52,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },
  progressBarBg: {
    width: "100%",
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2F5BD2",
    borderRadius: 999,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#2F5BD2",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9DCE3",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 16,
  },
  upNextTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  upNextList: {
    gap: 12,
  },
  upNextCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D9DCE3",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  upNextTaskTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  upNextTaskTime: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },
  upNextPriorityDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginLeft: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
});