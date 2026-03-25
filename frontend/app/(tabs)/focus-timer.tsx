import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";

const DEFAULT_TIME = 25 * 60; // 25 minutes in seconds



// Placeholder data
const currentTask = {
  title: "Read Chapter 5",
  time: "8:00–8:30 AM",
  priority: "high" as const,
};
const upNext = [
  { title: "Math Homework", time: "9:00 AM", priority: "medium" as const },
  { title: "Science Project", time: "10:00 AM", priority: "low" as const },
];

const priorityColors = {
  high: "#ff6b6b",
  medium: "#ffd166",
  low: "#6BCB77",
};



type Priority = keyof typeof priorityColors;

const FocusTimerScreen: React.FC = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Progress bar animation
  const progress = (DEFAULT_TIME - timeLeft) / DEFAULT_TIME;
  const progressAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => (t > 0 ? t - 1 : 0));
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeLeft === 0 && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsRunning(false);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartPause = () => {
    setIsRunning((r) => !r);
  };
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DEFAULT_TIME);
  };

  

  return (
    <SafeAreaView style={styles.bg}>
      
      <View style={styles.taskCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.taskLabel}>Current Task</Text>
          <Text style={styles.taskTitle}>{currentTask.title}</Text>
          <Text style={styles.taskTime}>{currentTask.time}</Text>
        </View>
        <View
          style={[
            styles.priorityDot,
            { backgroundColor: priorityColors[currentTask.priority] },
          ]}
        />
      </View>
      <View style={styles.timerCard}>
        <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        <View style={styles.progressBarWrap}>
          <Animated.View
            style={[
              styles.progressBar,
              { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }) },
            ]}
          />
        </View>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.primaryBtn]}
            onPress={handleStartPause}
            accessibilityLabel={isRunning ? "Pause timer" : "Start timer"}
          >
            <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.resetBtn]}
            onPress={handleReset}
            accessibilityLabel="Reset timer"
          >
            <Text style={[styles.buttonText, styles.resetText]}>Reset</Text>
          </Pressable>
        </View>
      </View>
      <Text style={styles.upNextTitle}>Up Next</Text>
      <View style={styles.upNextList}>
        {upNext.map((task, idx) => (
          <View key={idx} style={styles.upNextCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.upNextTaskTitle}>{task.title}</Text>
              <Text style={styles.upNextTaskTime}>{task.time}</Text>
            </View>
            <View
              style={[
                styles.upNextPriorityDot,
                { backgroundColor: priorityColors[task.priority] },
              ]}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f7fafd",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#f7fafd",
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  backArrow: {
    fontSize: 24,
    color: "#4F8CFF",
    fontWeight: "700",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    color: "#1a237e",
    letterSpacing: 0.2,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 18,
    marginTop: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  taskLabel: {
    fontSize: 13,
    color: "#607d8b",
    fontWeight: "700",
    marginBottom: 2,
  },
  taskTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 2,
  },
  taskTime: {
    fontSize: 14,
    color: "#4F8CFF",
    fontWeight: "600",
  },
  priorityDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginLeft: 12,
    borderWidth: 2,
    borderColor: "#f7fafd",
  },
  timerCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginHorizontal: 18,
    marginTop: 28,
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  timerText: {
    fontSize: 56,
    fontWeight: "800",
    color: "#1a237e",
    letterSpacing: 1,
    marginBottom: 10,
  },
  progressBarWrap: {
    width: "90%",
    height: 10,
    backgroundColor: "#e3eafc",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 18,
    alignSelf: "center",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#4F8CFF",
    borderRadius: 6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    marginTop: 8,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  primaryBtn: {
    backgroundColor: "#4F8CFF",
  },
  resetBtn: {
    backgroundColor: "#f1f3f4",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  resetText: {
    color: "#4F8CFF",
  },
  upNextTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a237e",
    marginLeft: 24,
    marginTop: 32,
    marginBottom: 8,
  },
  upNextList: {
    marginHorizontal: 18,
    marginBottom: 24,
  },
  upNextCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  upNextTaskTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    marginBottom: 2,
  },
  upNextTaskTime: {
    fontSize: 13,
    color: "#4F8CFF",
    fontWeight: "600",
  },
  upNextPriorityDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: 10,
    borderWidth: 1.5,
    borderColor: "#f7fafd",
  },
});

export default FocusTimerScreen;
