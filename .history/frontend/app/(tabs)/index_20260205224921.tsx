
import TaskForm from "../../components/TaskForm";


import React from "react";
import { View, Text } from "react-native";
import TaskForm, { TaskDraft } from "@/components/TaskForm";

export default function HomeScreen() {
  const handleCreateTask = (draft: TaskDraft) => {
    console.log("New ADHD-friendly task:", draft);
  };

  return (
    <View style={{ flex: 1, padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "800" }}>Create a Task</Text>
      <Text style={{ opacity: 0.75 }}>
        Quick add with low-overwhelm defaults (ADHD-friendly).
      </Text>

      <TaskForm onSubmit={handleCreateTask} />
    </View>
  );
}

