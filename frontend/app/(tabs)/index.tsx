//Tiffany Santiago Garcia
// Main screen showing active tasks with daily and half-day views, filtered by date/time and sorted by priority

import API_BASE_URL from "@/utils/config";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTasks } from "../../context/TasksContext";

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
  // const { user } = useLocalSearchParams();
  const id = 1; // FOR TESTING, DELETE WHEN DONE
  const router = useRouter();
  const { tasks, updateTask } = useTasks();

  const currentHour = new Date().getHours();
  const defaultHalfDay: HalfDayMode = currentHour < 12 ? "morning" : "afternoon";

  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [halfDayMode, setHalfDayMode] = useState<HalfDayMode>(defaultHalfDay);

  const [displayedTasks, setDisplayedTasks] = useState<Array<String>>([]);
  const [ error, setError ] = useState("");

  const activeTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.status !== "completed" && t.status !== "deleted"
    );
  }, [tasks]);

  // const displayedTasks = useMemo(async () => {
  //   let filteredTasks = [...activeTasks];

  //   // get all tasks
  //   if (viewMode === "all") await getAllTasks();

  //   if (viewMode === "daily") {
  //     filteredTasks = filteredTasks.filter((task) => isToday(task.dueDate));
  //     filteredTasks = filteredTasks.filter((task) => {
  //       const bucket = getHalfDayBucket(task.time);
  //       return bucket === halfDayMode;
  //     });
  //   }

  //   return filteredTasks.sort((a, b) => {
  //     const aDateTime = parseTaskDateTime(a.dueDate, a.time);
  //     const bDateTime = parseTaskDateTime(b.dueDate, b.time);

  //     if (aDateTime !== bDateTime) {
  //       return aDateTime - bDateTime;
  //     }

  //     return priorityOrder[b.priority] - priorityOrder[a.priority];
  //   });
  // }, [activeTasks, viewMode, halfDayMode]);

  const handleEdit = (id: string) => {
    router.push({ pathname: "./modal", params: { editingId: id } });
  };

  // get all of today's tasks
  const getAllTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/getAll?user_id=${id}`);
      const data = await response.json();
      console.log(response.status);

      if (response.status == 200) {
        console.log(data);
        setDisplayedTasks(data);
      } // set display tasks here
      else setError("Error getting today's tasks");

    } catch (error) {
      console.log("Error getting tasks");
    }
  }

  useEffect(() => { getAllTasks() }, [viewMode]);

  // get list of today's tasks
  const getTodayTasks =  async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/getToday?user_id=${id}`);
      const data = await response.json();

      if (response.ok) console.log(data);
      else console.log("Error getting today's tasks");

    } catch (error) {
      console.log("Error getting today's tasks");
    }
  }

  useEffect(() => { getTodayTasks() }, [viewMode]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F8FA" }}>
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", marginBottom: 12 }}>
          My Tasks for user { id }
        </Text>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
          <Pressable
          onPress={() => setViewMode("all")}
            // onPress={() => getAllTasks()}
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
            // onPress={() => getTodayTask()}
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

        {/*  display fetch error to users */}
        { error ? <Text>{error}</Text> : null }

        {displayedTasks.length === 0 ? (
          <Text style={{ opacity: 0.7, marginTop: 12, marginBottom: 12 }}>
            {viewMode === "all"
              ? 'No active tasks yet. Tap "+ Add Task" to create one.'
              : `No ${halfDayMode} tasks due today.`}
          </Text>
        ) : null}

        {/* <ScrollView
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
        </ScrollView> */}

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