import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTasks } from "../context/TasksContext";
import TaskCard from "../components/TaskCard";

export default function CompletedScreen() {
  const { tasks, updateTask } = useTasks();

  const completed = useMemo(
    () => tasks.filter((t) => t.status === "completed"),
    [tasks]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20, gap: 12 }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>Archived Tasks</Text>

        {completed.length === 0 ? (
          <Text style={{ opacity: 0.7 }}>No completed tasks yet.</Text>
        ) : (
          <ScrollView>
            {completed.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={() => {
                  // Optional: “restore” to in progress when you edit
                  updateTask(task.id, { ...task, status: "in_progress" });
                }}
                onComplete={() => {}}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
