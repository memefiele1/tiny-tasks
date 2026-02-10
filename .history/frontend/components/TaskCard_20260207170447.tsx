import React from "react";
import { View, Text } from "react-native";
import type { TaskDraft } from "./TaskForm";

type Props = {
  task: TaskDraft;
};

export default function TaskCard({ task }: Props) {
  const priorityColor =
    task.priority === "high"
      ? "#ff6b6b"
      : task.priority === "medium"
      ? "#ffd166"
      : "#6bcB77";

  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "800" }}>{task.title}</Text>

      <Text style={{ marginTop: 6 }}>Due: {task.dueDate}</Text>

      <View
        style={{
          marginTop: 8,
          alignSelf: "flex-start",
          backgroundColor: priorityColor,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
        }}
      >
        <Text style={{ marginTop: 6 }}>
        Status: {task.status.replace("_", " ").toUpperCase()}
        </Text>

        <Text style={{ fontWeight: "700" }}>{task.priority.toUpperCase()}</Text>
      </View>
    </View>
  );
}
