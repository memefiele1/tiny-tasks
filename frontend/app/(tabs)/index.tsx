//Tiffany Santiago Garcia
// Main screen showing active tasks with daily and half-day views, filtered by date/time and sorted by priority

import React, { useMemo, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskForm, { TaskDraft } from "../../components/TaskForm";
import TaskCard from "../../components/TaskCard";

type ViewMode = "daily" | "half-day";
type HalfDayMode = "morning" | "afternoon";

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

const getHalfDayBucket = (time?: string) => {
  if (!time) return null;

  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hour = Number(match[1]);
  const period = match[3].toUpperCase();

  if (period === "AM" && hour === 12) hour = 0;
  if (period === "PM" && hour !== 12) hour += 12;

  return hour < 12 ? "morning" : "afternoon";
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TaskDraft[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [viewMode, setViewMode] = useState<ViewMode>("daily");
  const [halfDayMode, setHalfDayMode] = useState<HalfDayMode>("morning");

  const displayedTasks = useMemo(() => {
    let filteredTasks = tasks.filter(
      (t) => t.status !== "completed" && t.status !== "deleted"
    );

    if (viewMode === "half-day") {
      filteredTasks = filteredTasks.filter((task) => {
        const bucket = getHalfDayBucket(task.time);
        return bucket === halfDayMode;
      });
    }

    return [...filteredTasks].sort((a, b) => {
      const dateTimeDiff =
        parseTaskDateTime(a.dueDate, a.time) -
        parseTaskDateTime(b.dueDate, b.time);

      if (dateTimeDiff !== 0) return dateTimeDiff;

      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [tasks, viewMode, halfDayMode]);

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

          <Pressable
            onPress={() => setViewMode("half-day")}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderWidth: 1,
              borderRadius: 12,
              borderColor: "#D9DCE3",
              backgroundColor: viewMode === "half-day" ? "#FFFFFF" : "#EDEEF2",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "700", color: "#2F5BD2" }}>
              Half-Day View
            </Text>
          </Pressable>
        </View>

        {viewMode === "half-day" && (
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

        {displayedTasks.length === 0 ? (
          <Text style={{ opacity: 0.7, marginTop: 12, marginBottom: 12 }}>
            No tasks in this view yet. Tap &quot;+ Add Task&quot; to create one.
          </Text>
        ) : null}

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