
import useUserContext from "@/context/UserContext";
import API_BASE_URL from "@/utils/config";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchTaskEstimate } from "../../utils/tasksApi";

const FOCUS_DURATION = 25 * 60;

const priorityColors = {
  high: "#ff6b6b",
  medium: "#ffd166",
  low: "#6bcB77",
} as const;

type BackendTask = {
  id?: string | number;
  task_id?: string | number;
  user_id?: string | number;
  title: string;
  description?: string;
  dueDate?: string;
  due_date?: string;
  time?: string;
  time_view?: string;
  priority: "high" | "medium" | "low";
  status?: string;
  is_completed?: number;
};

export default function FocusTimerScreen() {
  const { user: {user_id}} = useUserContext();

  const [tasks, setTasks] = useState<BackendTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);


  const [estimate, setEstimate] = useState<any | null>(null);
  const [estimateLoading, setEstimateLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const [manualSelectVisible, setManualSelectVisible] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [timerFinished, setTimerFinished] = useState(false);
  const [timerSessionId, setTimerSessionId] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const parseTaskDateTime = (dueDate?: string, time?: string) => {
    if (!dueDate) return Number.MAX_SAFE_INTEGER;

    const dateOnly = dueDate.split(" ")[0];
    const matchDate = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!matchDate) return Number.MAX_SAFE_INTEGER;

    const year = Number(matchDate[1]);
    const month = Number(matchDate[2]) - 1;
    const day = Number(matchDate[3]);

    let hours = 23;
    let minutes = 59;

    if (time) {
      const matchTime = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

      if (matchTime) {
        let hour = Number(matchTime[1]);
        const minute = Number(matchTime[2]);
        const period = matchTime[3].toUpperCase();

        if (period === "AM" && hour === 12) hour = 0;
        if (period === "PM" && hour !== 12) hour += 12;

        hours = hour;
        minutes = minute;
      }
    } else if (dueDate.includes(" ")) {
      const timePart = dueDate.split(" ")[1] ?? "";
      const match24 = timePart.match(/^(\d{2}):(\d{2})/);
      if (match24) {
        hours = Number(match24[1]);
        minutes = Number(match24[2]);
      }
    }

    return new Date(year, month, day, hours, minutes, 0, 0).getTime();
  };

  const fetchActiveTasks = async () => {
    try {
      setTasksLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/tasks/user/${user_id}`);
      const data = await response.json();

      console.log("FOCUS TASKS status:", response.status);
      console.log("FOCUS TASKS data:", data);

      if (response.ok && data.success) {
        const active = (data.tasks ?? []).filter(
          (task: BackendTask) =>
            task.status !== "completed" &&
            task.status !== "deleted" &&
            task.is_completed !== 1
        );
        setTasks(active);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.log("Error fetching focus tasks:", error);
      setTasks([]);
    } finally {
      setTasksLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActiveTasks();
    }, [user_id])
  );

  const activeTasks = useMemo(() => {
    return tasks.filter(
      (task) => task.status !== "completed" && task.status !== "deleted" && task.is_completed !== 1
    );
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    const priorityOrder = {
      high: 3,
      medium: 2,
      low: 1,
    } as const;

    return [...activeTasks].sort((a, b) => {
      const aDateTime = parseTaskDateTime(
        String(a.dueDate ?? a.due_date ?? ""),
        String(a.time ?? a.time_view ?? "")
      );
      const bDateTime = parseTaskDateTime(
        String(b.dueDate ?? b.due_date ?? ""),
        String(b.time ?? b.time_view ?? "")
      );

      if (aDateTime !== bDateTime) {
        return aDateTime - bDateTime;
      }

      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [activeTasks]);

  const currentTask = useMemo(() => {
    if (currentTaskId) {
      return (
        sortedTasks.find(
          (t) => String(t.id ?? t.task_id) === String(currentTaskId)
        ) ?? null
      );
    }
    return sortedTasks[0] ?? null;
  }, [sortedTasks, currentTaskId]);

  const upNext = useMemo(() => {
    if (!currentTask) return [];
    return sortedTasks
      .filter(
        (task) =>
          String(task.id ?? task.task_id) !==
          String(currentTask.id ?? currentTask.task_id)
      )
      .slice(0, 3);
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
          setTimerFinished(true);
          setShowCompletionPrompt(true);
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

  const completeTimerSession = async () => {
    if (!timerSessionId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/timer/${timerSessionId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user_id }),
      });

      const data = await response.json();
      console.log("COMPLETE TIMER:", data);
    } catch (error) {
      console.log("Error completing timer session:", error);
    } finally {
      setTimerSessionId(null);
    }
  };

  const handleStartPause = async () => {
    if (!currentTask) return;

    if (!isRunning) {
      try {
        if (!timerSessionId) {
          const taskId = currentTask.task_id ?? currentTask.id;

          const response = await fetch(`${API_BASE_URL}/api/timer/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user_id,
              task_id: taskId,
            }),
          });

          const data = await response.json();
          console.log("START TIMER:", data);

          if (response.ok && data.success) {
            setTimerSessionId(String(data.session.timer_id));
          }
        }

        setIsRunning(true);
        setTimerFinished(false);
      } catch (error) {
        console.log("Error starting timer:", error);
      }
    } else {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(FOCUS_DURATION);
    setTimerFinished(false);
  };

  const handleSelectTask = (taskId: string) => {
    setCurrentTaskId(taskId);
    setManualSelectVisible(false);
    setTimeLeft(FOCUS_DURATION);
    setIsRunning(false);
    setTimerFinished(false);
    setTimerSessionId(null);
  };

  const handleCompleteYes = async () => {
    if (!currentTask) return;

    try {
      const taskId = currentTask.task_id ?? currentTask.id;

      await completeTimerSession();

      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log("COMPLETE TASK:", data);
    } catch (error) {
      console.log("Error completing task:", error);
    }

    setShowCompletionPrompt(false);
    setTimerFinished(false);
    setTimeLeft(FOCUS_DURATION);
    setIsRunning(false);
    setCurrentTaskId(null);

    await fetchActiveTasks();
  };

  const handleCompleteNo = async () => {
    if (!currentTask) return;

    try {
      const taskId = currentTask.task_id ?? currentTask.id;
      const dueDateRaw = String(currentTask.dueDate ?? currentTask.due_date ?? "");
      const timeView = String(currentTask.time ?? currentTask.time_view ?? "");

      await completeTimerSession();

      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentTask.title,
          description: currentTask.description ?? "",
          due_date: dueDateRaw,
          priority: currentTask.priority,
          status: "in_progress",
          time_view: timeView,
        }),
      });

      const data = await response.json();
      console.log("MARK IN PROGRESS:", data);
    } catch (error) {
      console.log("Error marking task in progress:", error);
    }

    setShowCompletionPrompt(false);
    setTimerFinished(false);
    setTimeLeft(FOCUS_DURATION);
    setIsRunning(false);

    await fetchActiveTasks();
  };

  const currentTaskTime =
    currentTask?.time ??
    currentTask?.time_view ??
    (currentTask?.dueDate ?? currentTask?.due_date ?? "").split(" ")[1] ??
    "Add a task to get started";

  useEffect(() => {
  const loadEstimate = async () => {
    
    if (!currentTask) {
      setEstimate(null);
      return;
    }

    try {
      setEstimateLoading(true);
      const taskId = String(currentTask.task_id ?? currentTask.id);
      const data = await fetchTaskEstimate(taskId);

      console.log("ESTIMATE DATA:", data);
      console.log("ESTIMATION OBJECT:", data.estimation);

      setEstimate(data.estimation);
    } catch (error) {
      console.log("Error fetching estimate:", error);
      setEstimate(null);
    } finally {
      setEstimateLoading(false);
    }
  };

  loadEstimate();
}, [currentTask]);




  return (
    <SafeAreaView style={styles.bg}>
      <ScrollView>
      <View style={styles.screen}>
        <Text style={styles.headerTitle}>Focus Timer</Text>

        <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
          <Pressable
            style={[styles.secondaryButton, { width: 140, paddingVertical: 8 }]}
            onPress={() => setManualSelectVisible(true)}
          >
            <Text style={styles.secondaryButtonText}>Choose Task</Text>
          </Pressable>
        </View>

          <View style={styles.taskCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.taskLabel}>Recommended Task</Text>

        <Text
          style={{
            fontSize: 12,
            color: "#6B7280",
            marginBottom: 6,
          }}
        >
          Based on due date and priority
        </Text>

        <Text style={styles.taskTitle}>
          {currentTask ? currentTask.title : "No active task"}
        </Text>

        <Text style={styles.taskTime}>
          {currentTask ? currentTaskTime : "Add a task to get started"}
        </Text>

        {estimateLoading ? (
              <Text style={{ marginTop: 6, fontSize: 13, color: "#6B7280" }}>
                Estimating effort...
              </Text>
            ) : estimate ? (
              <View style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                  Estimated effort:{" "}
                  {estimate.personalized_estimated_label ??
                    estimate.estimated_label ??
                    "—"}
                </Text>

                {estimate?.minutes_until_due <= 1440 && estimate?.minutes_until_due >= 0 ? (
                  <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                    Time left until due:{" "}
                    {estimate.minutes_until_due > 60
                      ? `${Math.floor(estimate.minutes_until_due / 60)}h ${estimate.minutes_until_due % 60}m`
                      : `${estimate.minutes_until_due}m`}
                  </Text>
                ) : null}

                <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                  Confidence: {estimate.confidence ?? "low"} • Type: {estimate.task_type ?? "general"}
                </Text>

                {estimate.warning ? (
                  <Text style={{ fontSize: 13, color: "crimson", marginTop: 4 }}>
                    {estimate.warning}
                  </Text>
                ) : null}
              </View>
            ) : (
              <Text style={{ marginTop: 6, fontSize: 13, color: "#6B7280" }}>
                Estimated effort: —
              </Text>
            )}
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
            <Pressable
              style={styles.primaryButton}
              onPress={handleStartPause}
              disabled={!currentTask || tasksLoading}
            >
              <Text style={styles.primaryButtonText}>
                {isRunning ? "Pause" : "Start"}
              </Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={handleReset}>
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </Pressable>
          </View>

          {timerFinished && !showCompletionPrompt && (
            <Text style={{ color: "#2F5BD2", marginTop: 12, fontWeight: "600" }}>
              Take a short break before your next session!
            </Text>
          )}
        </View>

        <Text style={styles.upNextTitle}>Up Next</Text>

        <View style={styles.upNextList}>
          {upNext.length === 0 ? (
            <Text style={styles.emptyText}>
              {tasksLoading ? "Loading tasks..." : "No upcoming tasks yet."}
            </Text>
          ) : (
            upNext.map((task) => (
              <View key={String(task.task_id ?? task.id)} style={styles.upNextCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.upNextTaskTitle}>{task.title}</Text>
                  <Text style={styles.upNextTaskTime}>
                    {task.time ?? task.time_view ?? String(task.dueDate ?? task.due_date ?? "").split(" ")[0]}
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

        <Modal
          visible={showCompletionPrompt}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCompletionPrompt(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Is the current task completed?</Text>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 20 }}>
                <Pressable
                  style={[styles.primaryButton, { flex: 1 }]}
                  onPress={handleCompleteYes}
                >
                  <Text style={styles.primaryButtonText}>Yes</Text>
                </Pressable>
                <Pressable
                  style={[styles.secondaryButton, { flex: 1 }]}
                  onPress={handleCompleteNo}
                >
                  <Text style={styles.secondaryButtonText}>No</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={manualSelectVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setManualSelectVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: 400 }]}>
              <Text style={styles.modalTitle}>Select a Task</Text>
              <FlatList
                data={sortedTasks}
                keyExtractor={(item) => String(item.id ?? item.task_id)}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.taskSelectItem,
                      String(item.id ?? item.task_id) === String(currentTaskId) && {
                        backgroundColor: "#E5E7EB",
                      },
                    ]}
                    onPress={() => handleSelectTask(String(item.id ?? item.task_id))}
                  >
                    <Text style={styles.taskSelectTitle}>{item.title}</Text>
                    <View
                      style={[
                        styles.upNextPriorityDot,
                        { backgroundColor: priorityColors[item.priority] },
                      ]}
                    />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>No available tasks.</Text>
                }
                style={{ marginTop: 16, width: "100%" }}
              />
              <Pressable
                style={[styles.secondaryButton, { marginTop: 20, width: "100%" }]}
                onPress={() => setManualSelectVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  taskSelectItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 4,
  },
  taskSelectTitle: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "700",
  },
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