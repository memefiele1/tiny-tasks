import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { Task } from "../context/TasksContext";

type Props = {
  task: Task;
  onEdit: () => void;
  onComplete: () => void;
};

export default function TaskCard({ task, onEdit, onComplete }: Props) {
  const [expanded, setExpanded] = useState(false);

  const statusValue = task.status ?? "not_started";

  const priorityColor =
    task.priority === "high"
      ? "#ff6b6b"
      : task.priority === "medium"
      ? "#ffd166"
      : "#6bcB77";

  return (
    <Pressable
      onPress={() => setExpanded((e) => !e)}
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

      <Text style={{ marginTop: 6 }}>
        Status: {statusValue.replace("_", " ").toUpperCase()}
      </Text>

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
        <Text style={{ fontWeight: "700" }}>{task.priority.toUpperCase()}</Text>
      </View>

      {expanded && task.description?.trim() ? (
        <Text style={{ marginTop: 10, opacity: 0.8 }}>{task.description}</Text>
      ) : null}

      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "800" }}>Edit</Text>
        </Pressable>

        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onComplete();
          }}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "800" }}>Complete</Text>
        </Pressable>
      </View>

      <Text style={{ marginTop: 10, fontSize: 12, opacity: 0.6 }}>
        Tap card to {expanded ? "hide" : "show"} details
      </Text>
    </Pressable>
  );
}

