//Tiffany Santiago Garcia
// Main screen showing active tasks with daily and half-day views, filtered by date/time and sorted by priority

import React, { useMemo, useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import TaskCard from "../../components/TaskCard";
import { useTasks } from "../../context/TasksContext";
import { fetchMorningTasks, fetchAfternoonTasks } from "../../utils/tasksApi";




type ViewMode = "all" | "daily";
type HalfDayMode = "morning" | "afternoon";

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
} as const;

 const parseTaskDateTime = (dueDate?: string, time?: string) => {
  if (!dueDate) return Number.MAX_SAFE_INTEGER;

  // Parse YYYY-MM-DD manually to avoid UTC issues
  const matchDate = dueDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!matchDate) return Number.MAX_SAFE_INTEGER;

  const year = Number(matchDate[1]);
  const month = Number(matchDate[2]) - 1; // JS months are 0-based
  const day = Number(matchDate[3]);

  let hours = 23;
  let minutes = 59;

  // Parse time if provided (e.g. "2:00 PM")
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
  }

  // Create LOCAL date (this is the key fix)
  const combined = new Date(year, month, day, hours, minutes, 0, 0);

  return combined.getTime();
};


const parseLocalDate = (dateStr?: string) => {
  if (!dateStr) return null;

  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);

  return new Date(year, month, day);
};

const getHalfDayBucket = (time?: string): HalfDayMode | null => {
  if (!time) return null;

  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hour = Number(match[1]);
  const period = match[3].toUpperCase();

  if (period === "AM" && hour === 12) hour = 0;
  if (period === "PM" && hour !== 12) hour += 12;

  return hour < 12 ? "morning" : "afternoon";
};

const isToday = (dueDate?: string) => {
  const taskDate = parseLocalDate(dueDate);
  if (!taskDate) return false;

  const today = new Date();

  return (
    taskDate.getFullYear() === today.getFullYear() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getDate() === today.getDate()
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, updateTask } = useTasks();

    // --- Morning & Afternoon Tasks API State ---
  const [morningTasks, setMorningTasks] = useState<any[]>([]);
  const [morningLoading, setMorningLoading] = useState(false);
  const [morningError, setMorningError] = useState<string | null>(null);
  const [afternoonTasks, setAfternoonTasks] = useState<any[]>([]);
  const [afternoonLoading, setAfternoonLoading] = useState(false);
  const [afternoonError, setAfternoonError] = useState<string | null>(null);

  // Hardcoded user id for testing
const userId = "1";

const handleFetchMorningTasks = async () => {
  setMorningLoading(true);
  setMorningError(null);
  try {
    const today = new Date().toISOString().slice(0, 10);
    const tasks = await fetchMorningTasks(userId, today);
    setMorningTasks(tasks);
  } catch (err: any) {
    setMorningError(err.message);
    setMorningTasks([]);
  } finally {
    setMorningLoading(false);
  }
};

const handleFetchAfternoonTasks = async () => {
  setAfternoonLoading(true);
  setAfternoonError(null);
  try {
    const today = new Date().toISOString().slice(0, 10);
    const tasks = await fetchAfternoonTasks(userId, today);
    setAfternoonTasks(tasks);
  } catch (err: any) {
    setAfternoonError(err.message);
    setAfternoonTasks([]);
  } finally {
    setAfternoonLoading(false);
  }
};

  const currentHour = new Date().getHours();
  const defaultHalfDay: HalfDayMode = currentHour < 12 ? "morning" : "afternoon";

  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [halfDayMode, setHalfDayMode] = useState<HalfDayMode>(defaultHalfDay);

  useEffect(() => {
    if (viewMode === "daily" && halfDayMode === "morning") {
      handleFetchMorningTasks();
    } else if (viewMode === "daily" && halfDayMode === "afternoon") {
      handleFetchAfternoonTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, halfDayMode]);



 

  const activeTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.status !== "completed" && t.status !== "deleted"
    );
  }, [tasks]);

  const displayedTasks = useMemo(() => {
    let filteredTasks = [...activeTasks];

    if (viewMode === "daily") {
      filteredTasks = filteredTasks.filter((task) => isToday(task.dueDate));
      filteredTasks = filteredTasks.filter((task) => {
        const bucket = getHalfDayBucket(task.time);
        return bucket === halfDayMode;
      });
    }

    return filteredTasks.sort((a, b) => {
      const aDateTime = parseTaskDateTime(a.dueDate, a.time);
      const bDateTime = parseTaskDateTime(b.dueDate, b.time);

      if (aDateTime !== bDateTime) {
        return aDateTime - bDateTime;
      }

      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [activeTasks, viewMode, halfDayMode]);

  const handleEdit = (id: string) => {
    router.push({ pathname: "/modal", params: { editingId: id } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 12 }}>
          My Tasks
        </Text>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          <Pressable
            onPress={() => setViewMode("all")}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderWidth: 1,
              borderRadius: 12,
              borderColor: "#D9DCE3",
              backgroundColor: viewMode === "all" ? "#FFFFFF" : "#EDEEF2",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "700", color: "#2F5BD2" }}>
              All Tasks
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setViewMode("daily")}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderWidth: 1,
              borderRadius: 12,
              borderColor: "#D9DCE3",
              backgroundColor: viewMode === "daily" ? "#FFFFFF" : "#EDEEF2",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "700", color: "#2F5BD2" }}>
              Daily View
            </Text>
          </Pressable>
        </View>

        {viewMode === "daily" && (
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <Pressable
              onPress={() => setHalfDayMode("morning")}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderWidth: 1,
                borderRadius: 12,
                borderColor: "#D9DCE3",
                backgroundColor:
                  halfDayMode === "morning" ? "#FFFFFF" : "#EDEEF2",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#2F5BD2" }}>
                Morning
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setHalfDayMode("afternoon")}
              style={{
                flex: 1,
                paddingVertical: 12,
                borderWidth: 1,
                borderRadius: 12,
                borderColor: "#D9DCE3",
                backgroundColor:
                  halfDayMode === "afternoon" ? "#FFFFFF" : "#EDEEF2",
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "700", color: "#2F5BD2" }}>
                Afternoon
              </Text>
            </Pressable>
          </View>
        )}

        {viewMode === "daily" && halfDayMode === "morning" ? (
          morningLoading ? (
            <Text style={{ marginTop: 12 }}>Loading morning tasks...</Text>
          ) : morningError ? (
            <Text style={{ color: "crimson", marginTop: 12 }}>{morningError}</Text>
          ) : morningTasks.length === 0 ? (
            <Text style={{ opacity: 0.7, marginTop: 12, marginBottom: 12 }}>
              No morning tasks due today.
            </Text>
          ) : (
            <ScrollView
              style={{ flex: 1, marginTop: 8 }}
              contentContainerStyle={{ paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {morningTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEdit(task.id)}
                  onComplete={() =>
                    updateTask(task.id, { ...task, status: "completed" })
                  }
                />
              ))}
            </ScrollView>
          )
        ) : viewMode === "daily" && halfDayMode === "afternoon" ? (
          afternoonLoading ? (
            <Text style={{ marginTop: 12 }}>Loading afternoon tasks...</Text>
          ) : afternoonError ? (
            <Text style={{ color: "crimson", marginTop: 12 }}>{afternoonError}</Text>
          ) : afternoonTasks.length === 0 ? (
            <Text style={{ opacity: 0.7, marginTop: 12, marginBottom: 12 }}>
              No afternoon tasks due today.
            </Text>
          ) : (
            <ScrollView
              style={{ flex: 1, marginTop: 8 }}
              contentContainerStyle={{ paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {afternoonTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEdit(task.id)}
                  onComplete={() =>
                    updateTask(task.id, { ...task, status: "completed" })
                  }
                />
              ))}
            </ScrollView>
          )
        ) : (
          displayedTasks.length === 0 ? (
            <Text style={{ opacity: 0.7, marginTop: 12, marginBottom: 12 }}>
              {viewMode === "all"
                ? 'No active tasks yet. Tap "+ Add Task" to create one.'
                : `No ${halfDayMode} tasks due today.`}
            </Text>
          ) : (
            <ScrollView
              style={{ flex: 1, marginTop: 8 }}
              contentContainerStyle={{ paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
            >
              {displayedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => handleEdit(task.id)}
                  onComplete={() =>
                    updateTask(task.id, { ...task, status: "completed" })
                  }
                />
              ))}
            </ScrollView>
          )
        )}

        <Pressable
          onPress={() => router.push("/modal")}
          style={{
            marginTop: 12,
            paddingVertical: 14,
            borderRadius: 14,
            backgroundColor: "#2F5BD2",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "800", color: "#fff", fontSize: 16 }}>
            + Add Task
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}