import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import type { Task } from "../context/TasksContext";

type Props = {
  task: Task & {
    due_date?: string;
    time_view?: string;
    task_id?: number | string;
    estimateLabel?: string; // 👈 add this later when you wire API
  };
  onEdit: () => void;
  onComplete: () => void;
};

export default function TaskCard({ task, onEdit, onComplete }: Props) {
  const [expanded, setExpanded] = useState(false);

  const statusValue = task.status ?? "not_started";

  const priorityValue =
    typeof task.priority === "string"
      ? task.priority
      : String(task.priority ?? "medium");

  const priorityColor =
    priorityValue === "high"
      ? "#ff6b6b"
      : priorityValue === "medium"
      ? "#ffd166"
      : "#6bcB77";

  const rawDate = task.dueDate ?? task.due_date ?? "";
  const displayDate =
    typeof rawDate === "string" ? rawDate.split(" ")[0] : "";

  const displayTime = task.time ?? task.time_view ?? "";

  return (
    <Pressable
      onPress={() => setExpanded((e) => !e)}
      style={{
        borderWidth: 1,
        borderColor: "#D9DCE3",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        backgroundColor: "#fff",
      }}
    >
      {/* Title */}
      <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>
        {task.title}
      </Text>

      {/* Due */}
      <Text style={{ marginTop: 6, color: "#6B7280" }}>
        Due: {displayDate} {displayTime ? `at ${displayTime}` : ""}
      </Text>

      {/* Status */}
      <Text style={{ marginTop: 6, color: "#6B7280" }}>
        Status: {statusValue.replace("_", " ").toUpperCase()}
      </Text>

      {/* ⭐ Estimated Effort (NEW) */}
      <Text style={{ marginTop: 6, color: "#6B7280" }}>
        Estimated effort: {task.estimateLabel ?? "—"}
      </Text>

      {/* Priority pill */}
      <View
        style={{
          marginTop: 10,
          alignSelf: "flex-start",
          backgroundColor: priorityColor,
          paddingHorizontal: 12,
          paddingVertical: 5,
          borderRadius: 999,
        }}
      >
        <Text style={{ fontWeight: "700", color: "#111" }}>
          {priorityValue.toUpperCase()}
        </Text>
      </View>

      {/* Expanded description */}
      {expanded && task.description?.trim() ? (
        <Text style={{ marginTop: 10, color: "#374151" }}>
          {task.description}
        </Text>
      ) : null}

      {/* Buttons */}
      <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
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
            borderColor: "#D9DCE3",
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
            borderColor: "#D9DCE3",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "800" }}>Complete</Text>
        </Pressable>
      </View>

      {/* Helper text */}
      <Text style={{ marginTop: 10, fontSize: 12, color: "#9CA3AF" }}>
        Tap card to {expanded ? "hide" : "show"} details
      </Text>
    </Pressable>
  );
}